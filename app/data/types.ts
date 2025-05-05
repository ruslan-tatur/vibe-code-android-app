export enum GoalType {
  Percentage = 'percentage',
  Timeframe = 'timeframe',
}

export interface Goal {
  id?: number;
  name: string;
  type: GoalType;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
}
