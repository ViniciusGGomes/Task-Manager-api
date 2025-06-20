import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controllers";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated);
teamsRoutes.get(
  "/",
  verifyUserAuthorization(["member", "admin"]),
  teamsController.index
);
teamsRoutes.get(
  "/:team_id",
  verifyUserAuthorization(["member", "admin"]),
  teamsController.show
);
teamsRoutes.post(
  "/",
  verifyUserAuthorization(["admin"]),
  teamsController.create
);
teamsRoutes.patch(
  "/",
  verifyUserAuthorization(["admin"]),
  teamsController.update
);
teamsRoutes.delete(
  "/",
  verifyUserAuthorization(["admin"]),
  teamsController.remove
);

export { teamsRoutes };
