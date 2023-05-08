export interface Task {
  readonly id: number;
  readonly title: string;
  readonly startDate: Date;
  readonly completed: boolean;
}
  
export type TaskStatus = 'all' | 'completed' | 'onGoing';