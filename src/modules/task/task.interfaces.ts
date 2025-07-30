
import { Types } from 'mongoose';

export interface ICreateTaskPayload {
  title: string;
  description?: string;
  date: Date;
  task_status?: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
  category: Types.ObjectId;
  user: Types.ObjectId;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  date?: Date;
  task_status?: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
  category?: Types.ObjectId;
}

export interface IGetTasksQuery {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  userId: Types.ObjectId;
}

export interface ITaskResponse {
  tasks: any[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ITaskStats {
  total: number;
  pending: number;
  collaborative: number;
  ongoing: number;
  done: number;
  categories: {
    category: string;
    count: number;
  }[];
}



// import { Types } from 'mongoose';

// export interface ITask {
//   _id: Types.ObjectId;
//   title: string;
//   description: string;
//   date: Date;
//   task_status: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
//   category: string;
//   user: Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface ICreateTaskPayload {
//   title: string;
//   description: string;
//   date: Date;
//   task_status?: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
//   category: string;
//   user: Types.ObjectId;
// }

// export interface IUpdateTaskPayload {
//   title?: string;
//   description?: string;
//   date?: Date;
//   task_status?: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
//   category?: string;
// }

// export interface IGetTasksQuery {
//   page?: number;
//   limit?: number;
//   status?: 'all' | 'pending' | 'collaborative' | 'ongoing' | 'done';
//   category?: string;
//   search?: string;
//   userId: Types.ObjectId;
// }

// export interface ITaskResponse {
//   tasks: ITask[];
//   total: number;
//   page: number;
//   totalPages: number;
// }

// export interface ITaskStats {
//   total: number;
//   pending: number;
//   collaborative: number;
//   ongoing: number;
//   done: number;
//   categories: Array<{
//     category: string;
//     count: number;
//   }>;
// }