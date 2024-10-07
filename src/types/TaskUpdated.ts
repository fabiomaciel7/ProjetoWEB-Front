export interface TaskUpdated {
    title: string;
    description?: string;
    completed: boolean;
    dueDate: Date | string;
}