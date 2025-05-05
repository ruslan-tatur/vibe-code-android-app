import { Goal } from "../data/types";

export const calculateProgress = (goal: Goal): number => {
  if (!goal) return 0;

  if (goal.type === 'percentage') {
    return goal.progress ?? 0;
  } else if (goal.type === 'timeframe' && goal.startDate && goal.endDate) {
    const now = Date.now();
    const start = new Date(goal.startDate).getTime();
    const end = new Date(goal.endDate).getTime();
    if (end > start) {
      return parseInt(Math.min(
        100,
        Math.max(0, ((now - start) / (end - start)) * 100)
      ).toFixed(0));
    }
  }

  return 0;
}
