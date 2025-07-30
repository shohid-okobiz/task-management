import { Router } from "express";
import TaskControllers from '../../modules/task/task.controllers';


const router = Router();



const {
    handleCreateTask,
    handleGetTask,
    handleGetAllTasks,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateTaskStatus,
    handleGetTaskStats,
    handleGetTasksByDateRange
} = TaskControllers;


router
    .route("/create-new-task")
    .post(handleCreateTask);

router
    .route("/get-all-task")
    .get(handleGetAllTasks);


router
    .route("/stats")
    .get(handleGetTaskStats);


router
    .route("/date-range")
    .get(handleGetTasksByDateRange);


router
    .route("/task/:id")
    .get(handleGetTask);

router
    .route("/task/:id")
    .put(handleUpdateTask);


router
    .route("/task/:id")
    .delete(handleDeleteTask);


router
    .route("/task/:id/status")
    .patch(handleUpdateTaskStatus);

export default router;








