import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamMembersRoutes } from "./team-members-routes";
import { teamsRoutes } from "./teams-routes";
import { tasksRoutes } from "./tasks-routes";
import { taskHistoryRoutes } from "./task-history-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/teamMembers", teamMembersRoutes);
routes.use("/teams", teamsRoutes);
routes.use("/tasks", tasksRoutes);
routes.use("/task_history", taskHistoryRoutes);

export { routes };
