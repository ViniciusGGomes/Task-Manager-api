import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated);
tasksRoutes.post(
  "/",
  verifyUserAuthorization(["admin"]),
  tasksController.create
);
tasksRoutes.get(
  "/",
  verifyUserAuthorization(["admin", "member"]),
  tasksController.index
);
tasksRoutes.get(
  "/:team_id",
  verifyUserAuthorization(["admin", "member"]),
  tasksController.show
);
tasksRoutes.patch(
  "/:task_id",
  verifyUserAuthorization(["admin", "member"]),
  tasksController.update
);
tasksRoutes.delete(
  "/",
  verifyUserAuthorization(["admin"]),
  tasksController.remove
);

export { tasksRoutes };
