
import { NextFunction, Request, Response } from 'express';

import logger from '../../configs/logger.configs';
import { ICreateTaskPayload, IUpdateTaskPayload } from './task.interfaces';
import TaskServices from './task.services';

const {
  processCreateTask,
  processGetTask,
  processGetAllTasks,
  processUpdateTask,
  processDeleteTask,
  processUpdateTaskStatus,
  processGetTaskStats,
  processGetTasksByDateRange
} = TaskServices;

const TaskControllers = {
  handleCreateTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authenticateTokenDecoded?.userId;
      
      const taskPayload: ICreateTaskPayload = {
        ...req.body,
        user: userId,
        date: new Date(req.body.date)
      };

      const newTask = await processCreateTask(taskPayload);
      
      res.status(201).json({ 
        status: 'success',
        message: 'Task created successfully',
        data: newTask
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  },

  handleGetTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.authenticateTokenDecoded?.userId;

      const task = await processGetTask(id, userId);

      res.status(200).json({
        status: 'success',
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
  },

  handleGetAllTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authenticateTokenDecoded?.userId;
      const { page, limit, status, category, search } = req.query;

      const queryParams = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as any,
        category: category as string,
        search: search as string,
        userId
      };

      const tasksData = await processGetAllTasks(queryParams);

      res.status(200).json({
        status: 'success',
        message: 'Tasks retrieved successfully',
        data: tasksData
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  },

  handleUpdateTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.authenticateTokenDecoded?.userId;

      const updatePayload: IUpdateTaskPayload = {
        ...req.body
      };

     
      if (updatePayload.date) {
        updatePayload.date = new Date(updatePayload.date);
      }

      const updatedTask = await processUpdateTask(id, userId, updatePayload);

      res.status(200).json({
        status: 'success',
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  },

  handleDeleteTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.authenticateTokenDecoded?.userId;

      await processDeleteTask(id, userId);

      res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully'
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  },
   handleUpdateTaskStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { task_status } = req.body;
      const userId = req.authenticateTokenDecoded?.userId;

      const updatedTask = await processUpdateTaskStatus(id, userId, task_status);

      res.status(200).json({
        status: 'success',
        message: 'Task status updated successfully',
        data: updatedTask
      });
    } catch (error) {
      next()
      const err = error as Error;
      logger.error(err.message);
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  },

  handleGetTaskStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authenticateTokenDecoded?.userId;

      const stats = await processGetTaskStats(userId);

      res.status(200).json({
        status: 'success',
        message: 'Task statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
         next()
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  },

  handleGetTasksByDateRange: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authenticateTokenDecoded?.userId;
      const { startDate, endDate } = req.query;

      const tasks = await processGetTasksByDateRange(
        userId,
        startDate as string,
        endDate as string
      );

      res.status(200).json({
        status: 'success',
        message: 'Tasks retrieved successfully',
        data: tasks
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
          next()
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  }
}
export default TaskControllers;