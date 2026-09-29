/**
 * Chinese UI strings — 默认语言。
 *
 * chrome only：菜单/按钮/页头/页脚/表单 labels。
 * 内容（文章/案例/工具）保留源语言 — 它们是编辑型内容，强行翻译会破坏意义。
 */
export default {
  common: {
    appName: 'Aindgc',
    appTagline: 'AI 产品实验室',
    loading: '加载中…',
    error: '出错了',
    retry: '重试',
    close: '关闭',
    cancel: '取消',
    save: '保存',
    saving: '保存中…',
    edit: '编辑',
    delete: '删除',
    confirm: '确认',
    back: '返回',
    next: '下一页',
    previous: '上一页',
    submit: '提交',
    search: '搜索',
    reset: '重置',
    apply: '应用',
    optional: '可选',
    required: '必填',
    copy: '复制',
    copied: '已复制',
    download: '下载',
    share: '分享',
    closePreview: '关闭预览',
    showMore: '展开更多',
    showLess: '收起',
    notFound: '未找到',
    emptyState: '暂无内容',
    minutesShort: '分钟',
    viewsShort: '阅读',
    likesShort: '赞'
  },

  nav: {
    home: '首页',
    tools: '工具',
    workflow: '工作流',
    cases: '案例',
    insights: '洞察',
    skills: 'Skills',
    coding: 'Coding',
    more: '更多',
    roi: 'ROI',
    checkup: '体检',
    login: '登录',
    signup: '注册',
    profile: '个人资料',
    admin: '后台',
    logout: '退出登录'
  },

  hero: {
    eyebrow: 'AI 产品实验室',
    title: '让 AI 真正开始工作。',
    subtitle: '高级 AI 工作流、Agent、Skills、工具 — 全部免费、全部规则引擎、全部可复现。'
  },

  header: {
    skipToContent: '跳到正文',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    toggleTheme: '切换主题'
  },

  footer: {
    tagline: '高级 AI 产品实验室。Workflow · Agent · Skill · Tool。',
    columns: {
      product: '产品',
      resources: '资源',
      company: '公司',
      legal: '法律'
    },
    links: {
      tools: 'AI 工具',
      workflow: '工作流编辑器',
      cases: '项目案例',
      insights: '行业洞察',
      skills: 'Skills 市场',
      coding: 'Coding 模板',
      roi: 'ROI 计算器',
      checkup: 'AI 体检'
    },
    legal: {
      terms: '服务条款',
      privacy: '隐私政策',
      contact: '联系我们'
    },
    copyright: '© {year} Aindgc. 保留所有权利。',
    builtWith: '用心打造。'
  },

  auth: {
    loginTitle: '登录 Aindgc',
    loginSubtitle: '访问保存的工作流、生成器、AI 体检记录。',
    registerTitle: '创建你的 Aindgc 账号',
    registerSubtitle: '免费,无需信用卡。解锁点赞、历史记录、工作流编辑器。',
    email: '邮箱',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    nickname: '昵称',
    forgotPassword: '忘记密码?',
    noAccount: '还没有账号?',
    haveAccount: '已有账号?',
    signUpHere: '立即注册',
    signInHere: '立即登录',
    orContinueWith: '或继续使用',
    agreeTerms: '注册即同意我们的',
    termsOfService: '服务条款',
    andPrivacy: '和',
    privacyPolicy: '隐私政策',
    profileTitle: '个人资料',
    profileSubtitle: '账号信息和偏好设置',
    memberSince: '注册时间',
    lastSignIn: '上次登录',
    role: '角色',
    saveProfile: '保存修改',
    saved: '资料已更新',
    changePassword: '修改密码',
    dangerZone: '危险操作',
    deleteAccount: '注销账号',
    deleteAccountWarning: '将永久删除账号和所有关联数据。'
  },

  home: {
    section: {
      '01-workflow': {
        eyebrow: '01 · 工作流',
        title: '从想法到可运行的工作流。',
        subtitle: '拖拽编辑,导出 Markdown 或 JSON,丢进 Claude Code 或 Codex 即可执行。'
      },
      '02-capabilities': {
        eyebrow: '02 · 能力矩阵',
        title: '六个生成器。零锁定。',
        subtitle: 'Workflow / Skills / Context / Coding / Prompt / Schema — 全部确定性,全部免费。'
      },
      '03-tools': {
        eyebrow: '03 · 工具',
        title: '真正产出工作的工具。'
      },
      '04-roi': {
        eyebrow: '04 · ROI',
        title: '估算你的 AI 自动化潜力。',
        subtitle: '无需登录。无销售推销。只是滑块和一个数字 — 标注 "simulation"。'
      },
      '05-checkup': {
        eyebrow: '05 · 体检',
        title: '你的团队 AI 准备度如何?',
        subtitle: '6 个问题,5 分钟,个性化机会报告。'
      },
      '06-cases': {
        eyebrow: '06 · 案例',
        title: '我们做过的东西。',
        subtitle: '真实项目、原型、实验、概念 — 明确标注。'
      },
      '07-insights': {
        eyebrow: '07 · 洞察',
        title: '我们学到的。',
        subtitle: '来自真实项目的笔记。Agent、Workflow、Coding、Business、Productivity。'
      },
      '08-cta': {
        eyebrow: '08 · 行动',
        title: '别再读关于 AI 的文章。开始用它。',
        subtitle: '打开 Workbench,生成一个 workflow,丢进 Claude Code。'
      },
      '09-promise': {
        eyebrow: '09 · 承诺',
        title: '我们承诺的(和我们不承诺的)。'
      },
      '10-faq': {
        eyebrow: '10 · 常见问题',
        title: '经常被问到的问题。'
      }
    },
    ctaPrimary: '打开 Workbench',
    ctaSecondary: '查看所有工具'
  },

  search: {
    placeholder: '搜索…',
    noResults: '无结果',
    tryDifferent: '换个关键词试试',
    resultsFor: '"{query}" 的搜索结果',
    articles: '文章',
    cases: '案例',
    tools: '工具',
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
      subtitle: '数据库实时计数。',
      kpi: {
        articles: '文章',
        cases: '案例',
        tools: '工具',
        users: '用户'
      },
      recent: '最近更新的文章',
      featured: 'Featured 计数',
      trend: '用户注册 · 最近 7 天',
      refresh: '刷新'
    },
    table: {
      title: '标题',
      status: '状态',
      featured: 'Featured',
      views: '阅读',
      runs: '运行',
      updated: '更新',
      actions: '操作',
      type: '类型',
      user: '用户',
      email: '邮箱',
      role: '角色',
      lastSeen: '上次登录',
      joined: '注册',
      empty: '没有匹配的内容。',
      new: '新建 {entity}',
      edit: '编辑 {entity}',
      confirmDelete: '删除 "{name}"?',
      confirmDeleteText: '将软删除该记录。公开列表中将不再显示,但保留在数据库中以便审计。'
    },
    settings: {
      title: '站点设置',
      subtitle: '{count} 个配置项 · 运行时可改',
      hint: '公开配置通过 GET /api/site/config/public 暴露给前端。私有配置 (isPublic=0) 仅供后端服务内部使用。',
      publicOnly: '仅公开',
      key: 'Key',
      value: '值',
      type: '类型',
      scope: '范围',
      visibility: '可见性',
      description: '说明',
      public: '公开',
      private: '私有'
    }
  },

  errors: {
    network: '网络错误 — 请检查连接。',
    server: '服务器错误',
    notFound: '未找到',
    unauthorized: '请登录后继续',
    forbidden: '无访问权限',
    validation: '请检查表单错误',
    unknown: '未知错误'
  },

  notFound: {
    title: '页面未找到',
    subtitle: '你查找的页面不存在或已被移动。',
    backHome: '回到首页'
  }
}