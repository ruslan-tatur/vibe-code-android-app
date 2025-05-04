export type GoalType = 'percentage' | 'timeframe';

export interface Goal {
  id?: number;
  name: string;
  type: GoalType;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
}
