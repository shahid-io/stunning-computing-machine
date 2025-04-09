import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from '../enums/task-status.enum';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    type: string;

    @Prop({
        type: String,
        default: TaskStatus.Pending,
    })
    status: string;

    @Prop({ type: Number, default: 0, max: 3 })
    attempts: number;

    @Prop({ type: String })
    errorMessage?: string;

    @Prop({ type: Number, default: 0 }) // Higher value = higher priority
    priority: number;

    @Prop({ type: Date }) // Optional field for scheduling tasks
    scheduleAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);