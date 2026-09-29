/**
 * Built-in workflow templates shown in /workflow list.
 * Phase 12 will load these from t_workflow_template table.
 */

import type { WorkflowTemplate } from '@utils/workflowTypes'

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    slug: 'sales-lead-triage',
    name: 'Sales Lead Triage',
    description: '从 CRM 拉取新线索,AI 评分,自动分级并写回 CRM。',
    category: 'sales',
    complexity: 'beginner',
    graph: {
      name: 'Sales Lead Triage',
      description: '拉取线索 → AI 评分 → 分级 → 写回',
      nodes: [
        { id: 't1', type: 'trigger', position: { x: 80, y: 160 }, data: { kind: 'trigger', config: { label: 'New lead in CRM', description: '当 CRM 中新增 lead 记录时触发', payload: { type: 'webhook' } } } },
        { id: 'ai1', type: 'ai', position: { x: 360, y: 60 }, data: { kind: 'ai', config: { label: 'Score against ICP', description: '使用 AI 评分 0-100', payload: { model: 'claude-sonnet', system: 'You evaluate B2B SaaS leads.', user: 'Score this lead against ICP.' } } } },
        { id: 'ai2', type: 'ai', position: { x: 360, y: 260 }, data: { kind: 'ai', config: { label: 'Draft outreach', description: '为高分线索生成跟进邮件', payload: { model: 'claude-sonnet' } } } },
        { id: 'c1', type: 'condition', position: { x: 680, y: 160 }, data: { kind: 'condition', config: { label: 'Grade by score', payload: { expr: 'score >= 70', trueLabel: 'A', falseLabel: 'B / nurture' } } } },
        { id: 'a1', type: 'action', position: { x: 980, y: 60 }, data: { kind: 'action', config: { label: 'Notify sales', description: '高分线索通知销售', payload: { action: 'slack' } } } },
        { id: 'a2', type: 'action', position: { x: 980, y: 260 }, data: { kind: 'action', config: { label: 'Add to nurture', description: '低分线索进入培育序列', payload: { action: 'write' } } } },
        { id: 'o1', type: 'output', position: { x: 1280, y: 160 }, data: { kind: 'output', config: { label: 'CRM updated', payload: { format: 'json' } } } }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'ai1', data: { branch: 'always' } },
        { id: 'e2', source: 't1', target: 'ai2', data: { branch: 'always' } },
        { id: 'e3', source: 'ai1', target: 'c1', data: { branch: 'always' } },
        { id: 'e4', source: 'ai2', target: 'a1', data: { branch: 'always' } },
        { id: 'e5', source: 'c1', target: 'a1', data: { branch: 'onSuccess' } },
        { id: 'e6', source: 'c1', target: 'a2', data: { branch: 'onError' } },
        { id: 'e7', source: 'a1', target: 'o1', data: { branch: 'always' } },
        { id: 'e8', source: 'a2', target: 'o1', data: { branch: 'always' } }
      ]
    }
  },
  {
    slug: 'content-pipeline',
    name: 'Content Pipeline',
    description: '从选题到发布的完整 AI 内容流水线。',
    category: 'marketing',
    complexity: 'intermediate',
    graph: {
      name: 'Content Pipeline',
      description: '选题 → 撰写 → 审校 → 配图 → 发布',
      nodes: [
        { id: 't1', type: 'trigger', position: { x: 80, y: 160 }, data: { kind: 'trigger', config: { label: 'New topic', payload: { type: 'manual' } } } },
        { id: 'ai1', type: 'ai', position: { x: 360, y: 60 }, data: { kind: 'ai', config: { label: 'Research', description: '搜集资料与观点', payload: { model: 'claude-sonnet' } } } },
        { id: 'ai2', type: 'ai', position: { x: 360, y: 260 }, data: { kind: 'ai', config: { label: 'Draft', description: '生成初稿', payload: { model: 'claude-sonnet' } } } },
        { id: 'c1', type: 'condition', position: { x: 680, y: 160 }, data: { kind: 'condition', config: { label: 'Quality check', payload: { expr: 'quality >= 0.8' } } } },
        { id: 'a1', type: 'action', position: { x: 980, y: 60 }, data: { kind: 'action', config: { label: 'Generate cover', payload: { action: 'webhook' } } } },
        { id: 'a2', type: 'action', position: { x: 980, y: 260 }, data: { kind: 'action', config: { label: 'Revise', description: '打回重写', payload: { action: 'webhook' } } } },
        { id: 'o1', type: 'output', position: { x: 1280, y: 160 }, data: { kind: 'output', config: { label: 'Publish', payload: { format: 'markdown' } } } }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'ai1', data: { branch: 'always' } },
        { id: 'e2', source: 't1', target: 'ai2', data: { branch: 'always' } },
        { id: 'e3', source: 'ai1', target: 'c1', data: { branch: 'always' } },
        { id: 'e4', source: 'ai2', target: 'c1', data: { branch: 'always' } },
        { id: 'e5', source: 'c1', target: 'a1', data: { branch: 'onSuccess' } },
        { id: 'e6', source: 'c1', target: 'a2', data: { branch: 'onError' } },
        { id: 'e7', source: 'a1', target: 'o1', data: { branch: 'always' } },
        { id: 'e8', source: 'a2', target: 'ai2', data: { branch: 'always' } }
      ]
    }
  },
  {
    slug: 'support-router',
    name: 'Support Ticket Router',
    description: '客服工单自动分类、紧急度评估、分配坐席。',
    category: 'support',
    complexity: 'advanced',
    graph: {
      name: 'Support Ticket Router',
      description: '工单 → 分类 → 紧急度 → 分配',
      nodes: [
        { id: 't1', type: 'trigger', position: { x: 80, y: 160 }, data: { kind: 'trigger', config: { label: 'New ticket', payload: { type: 'webhook' } } } },
        { id: 'ai1', type: 'ai', position: { x: 360, y: 160 }, data: { kind: 'ai', config: { label: 'Classify', description: '工单分类 + 紧急度', payload: { model: 'claude-sonnet' } } } },
        { id: 'c1', type: 'condition', position: { x: 680, y: 60 }, data: { kind: 'condition', config: { label: 'Urgent?', payload: { expr: 'urgency === "high"' } } } },
        { id: 'c2', type: 'condition', position: { x: 680, y: 260 }, data: { kind: 'condition', config: { label: 'Category', payload: { expr: 'category === "billing"' } } } },
        { id: 'a1', type: 'action', position: { x: 980, y: -40 }, data: { kind: 'action', config: { label: 'Page on-call', payload: { action: 'slack' } } } },
        { id: 'a2', type: 'action', position: { x: 980, y: 160 }, data: { kind: 'action', config: { label: 'Route to billing', payload: { action: 'write' } } } },
        { id: 'a3', type: 'action', position: { x: 980, y: 360 }, data: { kind: 'action', config: { label: 'Auto-reply', payload: { action: 'email' } } } },
        { id: 'o1', type: 'output', position: { x: 1280, y: 160 }, data: { kind: 'output', config: { label: 'Routed', payload: { format: 'json' } } } }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'ai1', data: { branch: 'always' } },
        { id: 'e2', source: 'ai1', target: 'c1', data: { branch: 'always' } },
        { id: 'e3', source: 'ai1', target: 'c2', data: { branch: 'onError' } },
        { id: 'e4', source: 'c1', target: 'a1', data: { branch: 'onSuccess' } },
        { id: 'e5', source: 'c1', target: 'c2', data: { branch: 'onError' } },
        { id: 'e6', source: 'c2', target: 'a2', data: { branch: 'onSuccess' } },
        { id: 'e7', source: 'c2', target: 'a3', data: { branch: 'onError' } },
        { id: 'e8', source: 'a1', target: 'o1', data: { branch: 'always' } },
        { id: 'e9', source: 'a2', target: 'o1', data: { branch: 'always' } },
        { id: 'e10', source: 'a3', target: 'o1', data: { branch: 'always' } }
      ]
    }
  }
]

export function getTemplate(slug: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find(t => t.slug === slug)
}
