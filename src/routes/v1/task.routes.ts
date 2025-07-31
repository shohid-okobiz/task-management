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
    handleGetTasksByDateRange,
    handleUpdateOwnTaskStatus
} = TaskControllers;


router
    .route("/create-new-task")
    .post(checkAccessToken,handleCreateTask);

router
    .route("/get-all-task")
    .get(checkAccessToken,handleGetAllTasks);
router
    .route("/my-task/:id/status")
    .patch(checkAccessToken,handleUpdateOwnTaskStatus);

router
    .route("/stats")
    .get(handleGetTaskStats);


router
    .route("/date-range")
    .get(handleGetTasksByDateRange);


router
    .route("/task/:id")
    .get(checkAccessToken,handleGetTask);

router
    .route("/task/:id")
    .put(checkAccessToken,handleUpdateTask);


router
    .route("/task/:id")
    .delete(checkAccessToken,handleDeleteTask);


router
    .route("/task/:id/status")
    .patch(checkAccessToken,handleUpdateTaskStatus);

export default router;








