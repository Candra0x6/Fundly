import { Revenue, DistributionTx } from "@declarations/revenue_reporting/revenue_reporting.did";

export interface RevenueData {
  totalRevenue: string;
  totalDistributed: string;
  nextDistribution: string;
  distributionAmount: string;
  revenueGrowth: string;
  quarterlyRevenue: QuarterlyRevenueData[];
}

export interface QuarterlyRevenueData {
  quarter: string;
  revenue: number;
  distributions: number;
}

/**
 * Formats revenue data for display
 * @param revenues Array of revenue records
 * @returns Formatted display data
 */
export function formatToDisplayData(revenues: Revenue[]): RevenueData {
  const summary: Record<string, { revenue: number; distributions: number }> = {};
  let totalRevenue = 0;
  let totalDistributed = 0;
  let lastRevenue: Revenue | null = null;

  // Sort by reportDate (newest last)
  revenues.sort((a, b) => Number(a.reportDate - b.reportDate));

  revenues.forEach((rev: Revenue) => {
    const quarter = getQuarterFromDate(Number(rev.reportDate));

    if (!summary[quarter]) {
      summary[quarter] = { revenue: 0, distributions: 0 };
    }

    const amount = Number(rev.amount);
    summary[quarter].revenue += amount;
    totalRevenue += amount;

    rev.distributionTxs.forEach((tx: DistributionTx) => {
      const txAmount = Number(tx.amount);
      summary[quarter].distributions += txAmount;
      totalDistributed += txAmount;
    });

    lastRevenue = rev; // keep last revenue to extract nextDistribution info
  });

  const quarterlyRevenue = Object.entries(summary).map(([quarter, data]) => ({
    quarter,
    ...data,
  }));

  // Calculate next distribution date and amount
  const nextDistribution = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // next week

  const distributionAmount = lastRevenue
    // @ts-ignore
    ? lastRevenue.distributionTxs.reduce((sum: number, tx: DistributionTx) => sum + Number(tx.amount), 0)
    : 0;

  // Calculate growth rate
  const previousQuarterRevenue = quarterlyRevenue.length >= 2
    ? quarterlyRevenue[quarterlyRevenue.length - 2].revenue
    : 0;

  const currentQuarterRevenue = quarterlyRevenue.length > 0
    ? quarterlyRevenue[quarterlyRevenue.length - 1].revenue
    : 0;

  const growthRate = previousQuarterRevenue > 0
    ? ((currentQuarterRevenue - previousQuarterRevenue) / previousQuarterRevenue) * 100
    : 0;

  const growth = `+${Math.round(growthRate)}%`;

  return {
    totalRevenue: formatCurrency(totalRevenue),
    totalDistributed: formatCurrency(totalDistributed),
    nextDistribution: nextDistribution.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    distributionAmount: formatCurrency(distributionAmount),
    revenueGrowth: growth,
    quarterlyRevenue,
  };
}

/**
 * Converts a nanosecond timestamp to a quarter string (e.g. "Q1 2023")
 * @param nsTime Time in nanoseconds
 * @returns Quarter string representation
 */
function getQuarterFromDate(nsTime: number): string {
  const msTime = nsTime / 1_000_000; // nanoseconds to ms
  const date = new Date(msTime);
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter} ${year}`;
}

/**
 * Formats a number to a currency string
 * @param value Value to format
 * @returns Formatted currency string
 */
function formatCurrency(value: number): string {
  return `$${(value / 1000).toFixed(1)}K`;
}