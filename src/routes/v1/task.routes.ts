import { Router } from "express";
import TaskControllers from '../../modules/task/task.controllers';
import UserMiddlewares from "../../modules/user/user.middlewares";


const router = Router();

const { checkAccessToken, } = UserMiddlewares;

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
    .post(checkAccessToken,handleCreateTask);

router
    .route("/get-all-task")
    .get(checkAccessToken,handleGetAllTasks);


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








