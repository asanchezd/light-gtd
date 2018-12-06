import { TaskCategory } from './task-category.enum';
import { Entity } from "./entity.model";

export class Task extends Entity {
    description: string = '';
    createdAt: Date = new Date();
    category: TaskCategory = TaskCategory.Inbox;
    tags: string[] = [];
}
