/**
 * English UI strings — chrome only (navigation, buttons, form labels).
 *
 * Editorial content (articles, cases, tools) stays in its source language.
 * To localize content, replace the data source from local TS files to a
 * backend-driven CMS — Phase X.
 */
export default {
  common: {
    appName: 'Aindgc',
    appTagline: 'AI Product Lab',
    loading: 'Loading…',
    error: 'Something went wrong',
    retry: 'Retry',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    search: 'Search',
    reset: 'Reset',
    apply: 'Apply',
    optional: 'optional',
    required: 'required',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    share: 'Share',
    closePreview: 'Close preview',
    showMore: 'Show more',
    showLess: 'Show less',
    notFound: 'Not found',
    emptyState: 'Nothing here yet',
    minutesShort: 'min',
    viewsShort: 'views',
    likesShort: 'likes'
  },

  nav: {
    home: 'Home',
    tools: 'Tools',
    workflow: 'Workflow',
    cases: 'Cases',
    insights: 'Insights',
    skills: 'Skills',
    coding: 'Coding',
    more: 'More',
    roi: 'ROI',
    checkup: 'Checkup',
    login: 'Sign in',
    signup: 'Sign up',
    profile: 'Profile',
    admin: 'Admin',
    logout: 'Sign out'
  },

  hero: {
    eyebrow: 'AI PRODUCT LAB',
    title: 'Turn AI Into Work.',
    subtitle: 'Premium AI workflows, agents, skills, and tools — all free, all rule-engine-driven, all reproducible.'
  },

  header: {
    skipToContent: 'Skip to main content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toggleTheme: 'Toggle theme'
  },

  footer: {
    tagline: 'A premium AI product lab. Workflows · Agents · Skills · Tools.',
    columns: {
      product: 'Product',
      resources: 'Resources',
      company: 'Company',
      legal: 'Legal'
    },
    links: {
      tools: 'AI Tools',
      workflow: 'Workflow Builder',
      cases: 'Cases',
      insights: 'Insights',
      skills: 'Skills Marketplace',
      coding: 'Coding Templates',
      roi: 'ROI Calculator',
      checkup: 'AI Checkup'
    },
    legal: {
      terms: 'Terms',
      privacy: 'Privacy',
      contact: 'Contact'
    },
    copyright: '© {year} Aindgc. All rights reserved.',
    builtWith: 'Built with intent.'
  },

  auth: {
    loginTitle: 'Sign in to Aindgc',
    loginSubtitle: 'Access your saved workflows, generators, and AI checkups.',
    registerTitle: 'Create your Aindgc account',
    registerSubtitle: 'Free, no credit card. Unlock likes, history, and the workflow builder.',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm password',
    nickname: 'Nickname',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUpHere: 'Sign up here',
    signInHere: 'Sign in here',
    orContinueWith: 'or continue with',
    agreeTerms: 'By signing up, you agree to our',
    termsOfService: 'Terms of Service',
    andPrivacy: 'and',
    privacyPolicy: 'Privacy Policy',
    profileTitle: 'Your profile',
    profileSubtitle: 'Account information and preferences',
    memberSince: 'Member since',
    lastSignIn: 'Last sign-in',
    role: 'Role',
    saveProfile: 'Save changes',
    saved: 'Profile updated',
    changePassword: 'Change password',
    dangerZone: 'Danger zone',
    deleteAccount: 'Delete account',
    deleteAccountWarning: 'This will permanently delete your account and all associated data.'
  },

  home: {
    section: {
      '01-workflow': {
        eyebrow: '01 · WORKFLOW',
        title: 'From idea to runnable workflow.',
        subtitle: 'Drag-and-drop. Export Markdown or JSON. Drop into Claude Code or Codex.'
      },
      '02-capabilities': {
        eyebrow: '02 · CAPABILITIES',
        title: 'Six generators. Zero lock-in.',
        subtitle: 'Workflow / Skills / Context / Coding / Prompt / Schema — all deterministic, all free.'
      },
      '03-tools': {
        eyebrow: '03 · TOOLS',
        title: 'Tools that ship work.'
      },
      '04-roi': {
        eyebrow: '04 · ROI',
        title: 'Estimate your AI automation potential.',
        subtitle: 'No login. No sales pitch. Just sliders and a number — labeled "simulation".'
      },
      '05-checkup': {
        eyebrow: '05 · CHECKUP',
        title: 'How AI-ready is your team?',
        subtitle: '6 questions. 5 minutes. Personalized opportunity report.'
      },
      '06-cases': {
        eyebrow: '06 · CASES',
        title: 'Things we built.',
        subtitle: 'Real projects, prototypes, experiments, and concepts — clearly labeled.'
      },
      '07-insights': {
        eyebrow: '07 · INSIGHTS',
        title: 'What we learned.',
        subtitle: 'Notes from the field. Agent, workflow, coding, business, productivity.'
      },
      '08-cta': {
        eyebrow: '08 · CTA',
        title: 'Stop reading about AI. Start using it.',
        subtitle: 'Open the Workbench. Generate a workflow. Drop it into Claude Code.'
      },
      '09-promise': {
        eyebrow: '09 · PROMISE',
        title: 'What we promise (and what we don\'t).'
      },
      '10-faq': {
        eyebrow: '10 · FAQ',
        title: 'Frequently asked questions.'
      }
    },
    ctaPrimary: 'Open the Workbench',
    ctaSecondary: 'See all tools'
  },

  search: {
    placeholder: 'Search…',
    noResults: 'No results',
    tryDifferent: 'Try a different keyword',
    resultsFor: 'Results for "{query}"',
    articles: 'Articles',
    cases: 'Cases',
    tools: 'Tools',
    skills: 'Skills'
  },

  admin: {
    nav: {
      dashboard: 'Dashboard',
      articles: 'Articles',
      cases: 'Cases',
      tools: 'Tools',
      users: 'Users',
      settings: 'Settings'
    },
    dashboard: {
      title: 'Overview',
      subtitle: 'Live counts from the database.',
      kpi: {
        articles: 'Articles',
        cases: 'Case Projects',
        tools: 'Tools',
        users: 'Users'
      },
      recent: 'Recently updated articles',
      featured: 'Featured counts',
      trend: 'User signups · last 7 days',
      refresh: 'Refresh'
    },
    table: {
      title: 'Title',
      status: 'Status',
      featured: 'Featured',
      views: 'Views',
      runs: 'Runs',
      updated: 'Updated',
      actions: 'Actions',
      type: 'Type',
      user: 'User',
      email: 'Email',
      role: 'Role',
      lastSeen: 'Last sign-in',
      joined: 'Joined',
      empty: 'Nothing matches your filters.',
      new: 'New {entity}',
      edit: 'Edit {entity}',
      confirmDelete: 'Delete "{name}"?',
      confirmDeleteText: 'This will soft-delete the record. It will no longer appear in public listings but stays in the database for audit.'
    },
    settings: {
      title: 'Site settings',
      subtitle: '{count} config keys · runtime-editable',
      hint: 'Public configs are exposed via GET /api/site/config/public for the frontend. Private configs (isPublic=0) are only used internally by backend services.',
      publicOnly: 'Public only',
      key: 'Key',
      value: 'Value',
      type: 'Type',
      scope: 'Scope',
      visibility: 'Visibility',
      description: 'Description',
      public: 'Public',
      private: 'Private'
    }
  },

  errors: {
    network: 'Network error — please check your connection.',
    server: 'Server error',
    notFound: 'Not found',
    unauthorized: 'Please sign in to continue',
    forbidden: 'You don\'t have access to this',
    validation: 'Please check the form for errors',
    unknown: 'Unknown error'
  },

  notFound: {
    title: 'Page not found',
    subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.',
    backHome: 'Back to home'
  }
}