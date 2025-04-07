import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    type: string;

    @Prop({
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    })
    status: string;

    @Prop({ type: Number, default: 0, max: 3 })
    attempts: number;

    @Prop({ type: String,  })
    errorMessage?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);