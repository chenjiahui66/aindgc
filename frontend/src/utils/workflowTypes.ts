/**
 * Workflow types — shared between store, components, and persistence.
 * Mirrors a subset of the t_workflow_template / t_workflow DB schema (Phase 12).
 */

export type NodeKind = 'trigger' | 'ai' | 'condition' | 'tool' | 'action' | 'output'

export interface NodeConfig {
  /** Display label */
  label: string
  /** Description shown under the label */
  description?: string
  /** Free-form config payload per node type */
  payload?: Record<string, unknown>
}

export interface WorkflowNodeData {
  kind: NodeKind
  config: NodeConfig
}

export interface WorkflowEdgeData {
  /** Optional condition: 'always' | 'onSuccess' | 'onError' */
  branch?: 'always' | 'onSuccess' | 'onError'
}

export interface WorkflowGraph {
  id: string
  name: string
  description?: string
  nodes: Array<{
    id: string
    type: string
    position: { x: number; y: number }
    data: WorkflowNodeData
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
    data?: WorkflowEdgeData
  }>
  createdAt: number
  updatedAt: number
}

export interface WorkflowTemplate {
  slug: string
  name: string
  description: string
  category: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  graph: Omit<WorkflowGraph, 'id' | 'createdAt' | 'updatedAt'>
}

/** Node kind metadata — icon, default payload, etc. */
export const NODE_KINDS: Record<NodeKind, {
  label: string
  description: string
  iconName: string
  color: 'primary' | 'secondary' | 'warning' | 'success'
}> = {
  trigger: {
    label: 'Trigger',
    description: 'What starts this workflow',
    iconName: 'zap',
    color: 'warning'
  },
  ai: {
    label: 'AI',
    description: 'Reasoning, generation, classification',
    iconName: 'sparkles',
    color: 'primary'
  },
  condition: {
    label: 'Condition',
    description: 'Branch based on a rule',
    iconName: 'git-branch',
    color: 'secondary'
  },
  tool: {
    label: 'Tool',
    description: 'External service / API call',
    iconName: 'plug',
    color: 'secondary'
  },
  action: {
    label: 'Action',
    description: 'Write / send / update',
    iconName: 'send',
    color: 'success'
  },
  output: {
    label: 'Output',
    description: 'Final result for downstream use',
    iconName: 'flag',
    color: 'success'
  }
}
