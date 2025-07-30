import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  date: Date;
  task_status: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
  category: mongoose.Types.ObjectId; 
  user: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    task_status: {
      type: String,
      enum: ['all', 'pending', 'collaborative', 'ongoing', 'done'],
      default: 'pending',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);