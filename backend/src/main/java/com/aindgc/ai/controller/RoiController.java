package com.aindgc.ai.controller;

import com.aindgc.ai.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Pure computation endpoint. No DB persistence in Phase 12.
 * Phase 14 will add t_roi_record storage and share tokens.
 */
@Tag(name = "ROI", description = "AI ROI calculator")
@RestController
@RequestMapping("/api/roi")
public class RoiController {

    private static final int WORK_HOURS_PER_YEAR = 2080;
    private static final int AVG_REQUEST_MIN = 12;
    private static final int AVG_LEAD_MIN = 15;

    @PostMapping("/calculate")
    @Operation(summary = "Calculate ROI from inputs")
    public Result<Map<String, Object>> calculate(@RequestBody Map<String, Object> input) {
        int employees = num(input, "employees", 1);
        int salary = num(input, "avgMonthlySalary", 10000);
        int repeatHrs = num(input, "repeatableHoursPerWeek", 10);
        int custReq = num(input, "customerRequestsPerMonth", 0);
        int leads = num(input, "salesLeadsPerMonth", 0);
        double rate = Math.max(0, Math.min(1, numD(input, "automationRate", 0.4)));

        int annualSalaryCost = employees * salary * 12;
        int annualRepeatableHours = repeatHrs * employees * 52;
        int hourlyCost = salary / 160;
        int currentAnnualRepeatableCost = annualRepeatableHours * hourlyCost;
        int potentialSavings = (int) Math.round(currentAnnualRepeatableCost * rate);
        int custHrs = custReq * AVG_REQUEST_MIN / 60;
        int leadHrs = leads * AVG_LEAD_MIN / 60;
        int potentialPct = Math.max(20, Math.min(70, (int) Math.round((repeatHrs / 40.0) * 70 + 20)));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("metrics", Map.of(
            "annualSalaryCost", annualSalaryCost,
            "annualRepeatableHours", annualRepeatableHours,
            "currentAnnualRepeatableCost", currentAnnualRepeatableCost,
            "potentialAnnualSavings", potentialSavings,
            "customerRequestHoursPerMonth", custHrs,
            "salesLeadHoursPerMonth", leadHrs,
            "aiAutomationPotentialPct", potentialPct
        ));
        out.put("assumptions", Map.of(
            "workHoursPerYear", WORK_HOURS_PER_YEAR,
            "monthlyHourlyCost", hourlyCost,
            "avgHandlingTimePerRequestMin", AVG_REQUEST_MIN,
            "automationRate", rate
        ));
        out.put("disclaimer", "Estimated · Simulation. All values are illustrative. " +
            "Real impact depends on workflow design, data quality, and adoption.");
        return Result.ok(out);
    }

    private static int num(Map<String, Object> m, String k, int def) {
        Object v = m.get(k);
        if (v instanceof Number n) return n.intValue();
        try { return Integer.parseInt(String.valueOf(v)); } catch (Exception e) { return def; }
    }

    private static double numD(Map<String, Object> m, String k, double def) {
        Object v = m.get(k);
        if (v instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(String.valueOf(v)); } catch (Exception e) { return def; }
    }
}
