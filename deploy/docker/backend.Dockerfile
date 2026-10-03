# =====================================================================
# Aindgc backend — production image (H2 profile)
#
# Deliberately a RUNTIME image, not a builder image: the jar is built
# locally and uploaded. Building a Spring Boot app on a 1.6 GB server
# means Gradle/Maven + a full JDK resident at the same time as everything
# else, which is how you end up OOM-killing a production box.
#
# Build the jar first, on your machine:
#   cd backend && mvn clean package -DskipTests
# =====================================================================
FROM eclipse-temurin:17-jre-alpine

# Run as a non-root user; the image has no shell tooling we need.
RUN addgroup -S aindgc && adduser -S -G aindgc aindgc

WORKDIR /app
COPY backend/target/aindgc-backend.jar /app/app.jar

# /data holds the H2 database file. Must be a mounted volume or the
# database is lost on every container recreate.
RUN mkdir -p /data && chown -R aindgc:aindgc /data /app

USER aindgc

ENV SPRING_PROFILES_ACTIVE=h2 \
    AINDGC_DATA_DIR=/data

# H2 file databases are memory-mapped, so the JVM should size its heap against
# a ceiling rather than the host's total RAM. SerialGC keeps pause-time overhead
# down on a box this small.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1

# exec form via sh so JAVA_OPTS can be a single space-separated string.
ENTRYPOINT ["/bin/sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
