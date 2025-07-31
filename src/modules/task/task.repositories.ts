import mongoose, { Types } from 'mongoose';

import {
  ICreateTaskPayload,
  IUpdateTaskPayload,
  IGetTasksQuery,

  ITaskResponse,
  ITaskStats
} from './task.interfaces';
import { Category } from '../category/category.models';
import { Task } from './task.models';

const TaskRepositories = {
  createTask: async (payload: ICreateTaskPayload): Promise<ICreateTaskPayload> => {
    try {
       console.log("payload task === ", payload)
      const category = await Category.findOne({ _id: payload.category, user: payload.user });
      if (!category) {
        throw new Error('Category not found or does not belong to user');
      }

      const newTask = new Task(payload);
      const savedTask = await newTask.save();
      
      
      await savedTask.populate('category', 'name ');
      
      return savedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Task Creation Repository');
      }
    }
  },

  findTaskById: async (taskId: Types.ObjectId, userId: Types.ObjectId): Promise<ICreateTaskPayload | null> => {
    try {
      const task = await Task.findOne({ _id: taskId, user: userId })
        .populate('category', 'name ');
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Task Find Repository');
      }
    }
  },

  getAllTasks: async ({
    page = 1,
    limit = 10,
    status,
    category,
    search,
    userId
  }: IGetTasksQuery): Promise<ITaskResponse> => {
    try {
      const skip = (page - 1) * limit;
      
      const query: any = { user: userId };
      
      if (status && status !== 'all') {
        query.task_status = status;
      }
      
      if (category) {
        
        const categoryDoc = await Category.findOne({  user: userId });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          return {
            tasks: [],
            total: 0,
            page,
            totalPages: 0
          };
        }
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .populate('category', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Task.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        tasks: tasks as ICreateTaskPayload[],
        total,
        page,
        totalPages
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get All Tasks Repository');
      }
    }
  },

  updateTask: async (
    taskId: Types.ObjectId,
    userId: Types.ObjectId,
    payload: IUpdateTaskPayload
  ): Promise<ICreateTaskPayload | null> => {
    try {
     
      if (payload.category) {
        const category = await Category.findOne({ _id: payload.category, user: userId });
        if (!category) {
          throw new Error('Category not found or does not belong to user');
        }
      }

      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        { $set: payload },
        { new: true, runValidators: true }
      ).populate('category', 'name ');
      
      return updatedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Task Update Repository');
      }
    }
  },

  deleteTask: async (taskId: Types.ObjectId, userId: Types.ObjectId): Promise<ICreateTaskPayload | null> => {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });
      return deletedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Task Delete Repository');
      }
    }
  },

  getTaskStats: async (userId: Types.ObjectId): Promise<ITaskStats> => {
    try {
      const [statusStats, categoryStats, total] = await Promise.all([
        Task.aggregate([
          { $match: { user: userId } },
          {
            $group: {
              _id: '$task_status',
              count: { $sum: 1 }
            }
          }
        ]),
        Task.aggregate([
          { $match: { user: userId } },
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'categoryInfo'
            }
          },
          { $unwind: '$categoryInfo' },
          {
            $group: {
              _id: '$categoryInfo.name',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),
        Task.countDocuments({ user: userId })
      ]);

      
      const stats: ITaskStats = {
        total,
        pending: 0,
        collaborative: 0,
        ongoing: 0,
        done: 0,
        categories: categoryStats.map(cat => ({
          category: cat._id,
          count: cat.count
        }))
      };

      statusStats.forEach(stat => {
        if (stat._id === 'pending') stats.pending = stat.count;
        else if (stat._id === 'collaborative') stats.collaborative = stat.count;
        else if (stat._id === 'ongoing') stats.ongoing = stat.count;
        else if (stat._id === 'done') stats.done = stat.count;
      });

      return stats;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Task Stats Repository');
      }
    }
  },

  getTasksByDateRange: async (
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<ICreateTaskPayload[]> => {
    try {
      const tasks = await Task.find({
        user: userId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate('category', 'name')
      .sort({ date: 1 });

      return tasks;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Date Range Tasks Repository');
      }
    }
  }
};

export default TaskRepositories;