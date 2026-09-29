/**
 * ROI Calculator
 * Pure deterministic estimator — no AI, no fake numbers.
 * All outputs are explicitly marked as "Estimated · Simulation".
 */

export interface RoiInput {
  employees: number
  avgMonthlySalary: number       // CNY
  repeatableHoursPerWeek: number // per employee
  customerRequestsPerMonth: number
  salesLeadsPerMonth: number
  /** Optional: how aggressive the AI automation can be (0-1). Defaults to 0.4. */
  automationRate?: number
}

export interface RoiOutput {
  inputs: RoiInput
  assumptions: {
    workHoursPerYear: number
    monthlyHourlyCost: number
    avgHandlingTimePerRequestMin: number
    automationRate: number
  }
  metrics: {
    annualSalaryCost: number
    annualRepeatableHours: number
    currentAnnualRepeatableCost: number
    potentialAnnualSavings: number
    customerRequestHoursPerMonth: number
    salesLeadHoursPerMonth: number
    aiAutomationPotentialPct: number
    paybackMonths: number | null
  }
  disclaimer: string
}

const ASSUMPTIONS = {
  workHoursPerYear: 2080, // 40h * 52w
  weeksPerYear: 52,
  monthsPerYear: 12,
  workDaysPerYear: 250,
  avgHandlingTimePerRequestMin: 12, // minutes per customer request
  avgLeadHandlingMin: 15
}

export function calculateRoi(input: RoiInput): RoiOutput {
  const automationRate = clamp(input.automationRate ?? 0.4, 0, 1)

  const workHoursPerYear = ASSUMPTIONS.workHoursPerYear
  const monthlyHourlyCost = input.avgMonthlySalary / 160 // ~160 working hours / month

  const annualSalaryCost = input.avgMonthlySalary * input.employees * ASSUMPTIONS.monthsPerYear
  const annualRepeatableHours =
    input.repeatableHoursPerWeek * input.employees * ASSUMPTIONS.weeksPerYear
  const currentAnnualRepeatableCost = annualRepeatableHours * monthlyHourlyCost
  const potentialAnnualSavings = currentAnnualRepeatableCost * automationRate

  const customerRequestHoursPerMonth =
    (input.customerRequestsPerMonth * ASSUMPTIONS.avgHandlingTimePerRequestMin) / 60
  const salesLeadHoursPerMonth =
    (input.salesLeadsPerMonth * ASSUMPTIONS.avgLeadHandlingMin) / 60

  // Heuristic for AI automation potential %
  const repeatablePct =
    input.repeatableHoursPerWeek / 40 // 40h = full work week
  const aiAutomationPotentialPct = clamp(Math.round(repeatablePct * 70 + 20), 20, 70)

  return {
    inputs: input,
    assumptions: {
      workHoursPerYear,
      monthlyHourlyCost,
      avgHandlingTimePerRequestMin: ASSUMPTIONS.avgHandlingTimePerRequestMin,
      automationRate
    },
    metrics: {
      annualSalaryCost,
      annualRepeatableHours,
      currentAnnualRepeatableCost,
      potentialAnnualSavings,
      customerRequestHoursPerMonth,
      salesLeadHoursPerMonth,
      aiAutomationPotentialPct,
      // Estimate payback if we assume a $20k / year baseline AI tool cost
      paybackMonths: potentialAnnualSavings > 0
        ? Math.max(1, Math.round((20000 / 12) / (potentialAnnualSavings / 12)))
        : null
    },
    disclaimer:
      'Estimated · Simulation. All values are illustrative. Real impact depends on workflow design, data quality, and adoption. Use as a starting point for planning, not as a financial projection.'
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

export function formatCurrency(n: number, currency = 'CNY'): string {
  try {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(n)
  } catch {
    return `¥${Math.round(n).toLocaleString()}`
  }
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}
