import { Types } from 'mongoose';

import {
  ICreateTaskPayload,
  IUpdateTaskPayload,
  IGetTasksQuery,
  ITaskResponse,
  ITaskStats
} from './task.interfaces';
import TaskRepositories from './task.repositories';

const {
  createTask,
  findTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getTasksByDateRange
} = TaskRepositories;

const TaskServices = {
  processCreateTask: async (payload: ICreateTaskPayload): Promise<ICreateTaskPayload> => {
    try {
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (payload.date < today) {
        throw new Error('Task date cannot be in the past');
      }

      const newTask = await createTask(payload);
      return newTask;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Create Task Service');
      }
    }
  },

  processGetTask: async (taskId: string, userId: Types.ObjectId): Promise<any> => {
    try {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task ID');
      }

      const task = await findTaskById(
        new Types.ObjectId(taskId),
        new Types.ObjectId(userId)
      );

      if (!task) {
        throw new Error('Task not found');
      }

      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Task Service');
      }
    }
  },

  processGetAllTasks: async (query: IGetTasksQuery): Promise<ITaskResponse> => {
    try {
      // Validate pagination parameters
      const page = Math.max(1, query.page || 1);
      const limit = Math.min(Math.max(1, query.limit || 10), 50); // Max 50 items per page

      const tasksData = await getAllTasks({
        ...query,
        page,
        limit
      });

      return tasksData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get All Tasks Service');
      }
    }
  },

  processUpdateTask: async (
    taskId: string,
    userId: Types.ObjectId,
    payload: IUpdateTaskPayload
  ): Promise<any> => {
    try {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task ID');
      }

      // Validate date if provided
      if (payload.date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (payload.date < today) {
          throw new Error('Task date cannot be in the past');
        }
      }

      const updatedTask = await updateTask(
        new Types.ObjectId(taskId),
        new Types.ObjectId(userId),
        payload
      );

      if (!updatedTask) {
        throw new Error('Task not found or you do not have permission to update this task');
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update Task Service');
      }
    }
  },

  processDeleteTask: async (taskId: string, userId: Types.ObjectId): Promise<void> => {
    try {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task ID');
      }

      const deletedTask = await deleteTask(
        new Types.ObjectId(taskId),
        new Types.ObjectId(userId)
      );

      if (!deletedTask) {
        throw new Error('Task not found or you do not have permission to delete this task');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Delete Task Service');
      }
    }
  },

  processUpdateTaskStatus: async (
    taskId: string,
    userId: Types.ObjectId,
    status: 'pending' | 'collaborative' | 'ongoing' | 'done'
  ): Promise<any> => {
    try {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task ID');
      }

      const validStatuses = ['pending', 'collaborative', 'ongoing', 'done'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid task status');
      }

      const updatedTask = await updateTask(
        new Types.ObjectId(taskId),
        new Types.ObjectId(userId),
        { task_status: status }
      );

      if (!updatedTask) {
        throw new Error('Task not found or you do not have permission to update this task');
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update Task Status Service');
      }
    }
  },

  processGetTaskStats: async (userId: Types.ObjectId): Promise<ITaskStats> => {
    try {
      const stats = await getTaskStats(new Types.ObjectId(userId));
      return stats;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Task Stats Service');
      }
    }
  },

  processGetTasksByDateRange: async (
    userId: Types.ObjectId,
    startDate: string,
    endDate: string
  ): Promise<any[]> => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      if (start > end) {
        throw new Error('Start date cannot be after end date');
      }

      const tasks = await getTasksByDateRange(
        new Types.ObjectId(userId),
        start,
        end
      );

      return tasks;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Tasks By Date Range Service');
      }
    }
  }
};

export default TaskServices;