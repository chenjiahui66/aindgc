/**
 * Checkup questions + scoring engine.
 * 6-step questionnaire → AI Readiness Score + Top 5 opportunities.
 */

export type AnswerValue = string | number

export interface QuestionOption {
  label: string
  value: string
  /** Higher means better AI readiness for this answer */
  weight: number
}

export interface Question {
  id: string
  step: number
  title: string
  description?: string
  options: QuestionOption[]
}

export interface Opportunity {
  id: string
  title: string
  description: string
  impact: 'High' | 'Medium' | 'Low'
  difficulty: 'Low' | 'Medium' | 'High'
  category: 'sales' | 'support' | 'content' | 'data' | 'ops' | 'dev'
}

export const QUESTIONS: Question[] = [
  {
    id: 'industry',
    step: 1,
    title: 'Which industry are you in?',
    description: 'Used to calibrate opportunity matching.',
    options: [
      { label: 'Sales & Marketing',     value: 'sales',   weight: 1 },
      { label: 'Customer Service',      value: 'support', weight: 1 },
      { label: 'Software / Tech',       value: 'tech',    weight: 1 },
      { label: 'Operations / HR',       value: 'ops',     weight: 1 },
      { label: 'Education / Content',   value: 'edu',     weight: 1 },
      { label: 'Manufacturing',         value: 'mfg',     weight: 1 },
      { label: 'Other',                 value: 'other',   weight: 1 }
    ]
  },
  {
    id: 'role',
    step: 2,
    title: 'What is your role?',
    description: 'Helps tailor recommendations.',
    options: [
      { label: 'Individual contributor', value: 'ic',     weight: 1 },
      { label: 'Team lead / manager',    value: 'lead',   weight: 1 },
      { label: 'Founder / executive',    value: 'exec',   weight: 1 },
      { label: 'Operations / analyst',   value: 'ops',    weight: 1 }
    ]
  },
  {
    id: 'workload',
    step: 3,
    title: 'How much of your work is repeatable?',
    description: 'Repeatable work is the easiest first target for AI.',
    options: [
      { label: 'Almost none — most of it is novel', value: 'a', weight: 0 },
      { label: 'Some — about 20-40%',               value: 'b', weight: 2 },
      { label: 'A lot — about 40-70%',              value: 'c', weight: 4 },
      { label: 'Almost all — heavy routine',        value: 'd', weight: 5 }
    ]
  },
  {
    id: 'pain',
    step: 4,
    title: 'Where does time currently leak? (pick the biggest)',
    options: [
      { label: 'Writing & communication (emails, docs, reports)', value: 'writing', weight: 1 },
      { label: 'Research & summarization',                       value: 'research', weight: 1 },
      { label: 'Data entry / form filling',                      value: 'data',     weight: 1 },
      { label: 'Customer Q&A / support replies',                 value: 'support',  weight: 1 },
      { label: 'Meetings / scheduling / follow-up',              value: 'meetings', weight: 1 },
      { label: 'Coding / technical work',                        value: 'coding',   weight: 1 }
    ]
  },
  {
    id: 'data',
    step: 5,
    title: 'How is your work data stored?',
    description: 'AI needs data — even messy data is workable; paper-only is harder.',
    options: [
      { label: 'In a modern SaaS (Notion, Salesforce, etc.)',  value: 'saas',      weight: 5 },
      { label: 'In spreadsheets / Google Sheets',               value: 'sheet',     weight: 4 },
      { label: 'In our own database',                            value: 'db',        weight: 5 },
      { label: 'Mix of cloud + local files',                     value: 'mixed',     weight: 3 },
      { label: 'Mostly paper / email only',                      value: 'paper',     weight: 1 }
    ]
  },
  {
    id: 'aiUsage',
    step: 6,
    title: 'How is your team using AI today?',
    description: 'We use this to gauge your readiness, not to gatekeep.',
    options: [
      { label: 'Never tried',                              value: 'none',    weight: 0 },
      { label: 'Occasional ChatGPT / Claude for one-off tasks', value: 'casual',  weight: 2 },
      { label: 'Daily across the team',                   value: 'daily',   weight: 4 },
      { label: 'Built into our tools and workflows',       value: 'embedded', weight: 5 }
    ]
  }
]

export interface CheckupSubmission {
  answers: Record<string, string>
}

export interface CheckupResult {
  score: number                   // 0-100
  band: 'Explorer' | 'Builder' | 'Operator' | 'Architect'
  /** Strengths — areas where the user scored well */
  strengths: string[]
  /** Gaps — areas where the user can improve */
  gaps: string[]
  /** Top opportunities to pursue next */
  opportunities: Array<{
    opportunity: Opportunity
    relevance: number // 0-1
    reason: string
  }>
  /** Raw per-question scores for transparency */
  breakdown: Array<{ questionId: string; answer: string; weight: number; max: number }>
  disclaimer: string
}

const OPPORTUNITIES_POOL: Record<string, Opportunity[]> = {
  writing: [
    { id: 'meeting-summary', title: 'Meeting Summary', description: 'AI 总结会议录音/纪要,提取决策和行动项。', impact: 'High', difficulty: 'Low', category: 'ops' },
    { id: 'customer-followup', title: 'Customer Follow-up', description: '基于上下文自动生成个性化跟进邮件。', impact: 'High', difficulty: 'Medium', category: 'sales' },
    { id: 'weekly-report', title: 'Weekly Report', description: '汇总本周数据自动生成报告初稿。', impact: 'Medium', difficulty: 'Low', category: 'ops' }
  ],
  research: [
    { id: 'knowledge-search', title: 'Knowledge Search', description: '让 AI 在内部文档库中检索并回答问题。', impact: 'High', difficulty: 'Medium', category: 'ops' },
    { id: 'competitor-watch', title: 'Competitor Watch', description: '定时抓取并总结竞品动态。', impact: 'Medium', difficulty: 'Medium', category: 'sales' }
  ],
  data: [
    { id: 'lead-qualification', title: 'Lead Qualification', description: '用 AI 评分线索并写回 CRM。', impact: 'High', difficulty: 'Medium', category: 'sales' },
    { id: 'invoice-ocr', title: 'Invoice / Receipt OCR', description: 'AI 提取发票/收据字段自动入账。', impact: 'Medium', difficulty: 'Low', category: 'ops' }
  ],
  support: [
    { id: 'ticket-triage', title: 'Ticket Triage', description: 'AI 自动分类 + 紧急度评估 + 分配坐席。', impact: 'High', difficulty: 'Medium', category: 'support' },
    { id: 'faq-bot', title: 'FAQ Bot', description: '基于知识库自动回答常见问题。', impact: 'High', difficulty: 'Medium', category: 'support' }
  ],
  meetings: [
    { id: 'meeting-summary-2', title: 'Meeting Summary', description: '会议录音自动转写 + 提取行动项。', impact: 'High', difficulty: 'Low', category: 'ops' },
    { id: 'scheduling-bot', title: 'Scheduling Bot', description: 'AI 助理处理日程协调和提醒。', impact: 'Medium', difficulty: 'Medium', category: 'ops' }
  ],
  coding: [
    { id: 'ai-coding-pair', title: 'AI Coding Pair', description: '把 Claude Code / Codex 引入日常工作流。', impact: 'High', difficulty: 'Medium', category: 'dev' },
    { id: 'code-review-bot', title: 'Code Review Bot', description: 'AI 评审 PR diff,人类只看关键变更。', impact: 'Medium', difficulty: 'Low', category: 'dev' }
  ]
}

export function scoreCheckup(submission: CheckupSubmission): CheckupResult {
  const breakdown: CheckupResult['breakdown'] = []
  let totalScore = 0
  let totalMax = 0
  const strengths: string[] = []
  const gaps: string[] = []

  for (const q of QUESTIONS) {
    const ans = submission.answers[q.id] || ''
    const opt = q.options.find(o => o.value === ans)
    const weight = opt?.weight ?? 0
    const max = Math.max(...q.options.map(o => o.weight))
    breakdown.push({ questionId: q.id, answer: ans, weight, max })
    totalScore += weight
    totalMax += max

    if (weight >= max * 0.8) strengths.push(q.title)
    else if (weight <= max * 0.3) gaps.push(q.title)
  }

  const score = Math.round((totalScore / totalMax) * 100)

  let band: CheckupResult['band'] = 'Explorer'
  if (score >= 80) band = 'Architect'
  else if (score >= 60) band = 'Operator'
  else if (score >= 35) band = 'Builder'

  // Match opportunities
  const pain = submission.answers['pain'] || 'writing'
  const pool = OPPORTUNITIES_POOL[pain] || OPPORTUNITIES_POOL['writing']

  const opportunities = pool
    .map(opp => ({
      opportunity: opp,
      // crude relevance: higher AI usage + better data = more relevance
      relevance: clamp(
        (Number(submission.answers['aiUsage'] === 'embedded') * 1) +
        (Number(submission.answers['data'] === 'saas' || submission.answers['data'] === 'db') * 0.4) +
        0.6,
        0, 1
      ),
      reason: reasonFor(pain, submission.answers)
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)

  return {
    score,
    band,
    strengths,
    gaps,
    opportunities,
    breakdown,
    disclaimer:
      'This is a heuristic self-assessment. It is meant as a starting point for planning, not a definitive audit. Real AI readiness depends on team capability, data quality, and change management.'
  }
}

function reasonFor(pain: string, answers: Record<string, string>): string {
  const map: Record<string, string> = {
    writing:    'You spend significant time on writing and communication — AI excels here.',
    research:   'Research tasks are high-leverage targets for AI summarization.',
    data:       'Data entry and form filling are prime candidates for AI automation.',
    support:    'Customer Q&A is one of the highest-ROI AI use cases.',
    meetings:   'Meeting summarization and scheduling are quick wins.',
    coding:     'AI coding tools (Claude Code, Codex) deliver immediate productivity gains.'
  }
  return map[pain] || 'High-impact opportunity based on your pain point.'
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}
