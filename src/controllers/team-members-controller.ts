import { Request, Response } from "express";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TeamMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      team_id: z.string().uuid(),
    });

    const { user_id, team_id } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found");
    }

    const team = await prisma.team.findFirst({
      where: {
        id: team_id,
      },
    });

    if (!team) {
      throw new AppError("Team not found");
    }

    const existingTeamMember = await prisma.teamMember.findFirst({
      where: {
        userId: user_id,
        teamId: team_id,
      },
    });

    if (existingTeamMember) {
      throw new AppError("This user is already in the team");
    }

    const members = await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team_id,
      },
    });

    return response.status(201).json({ members });
  }

  async remove(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      team_id: z.string().uuid(),
    });

    const { user_id, team_id } = bodySchema.parse(request.body);

    const team = await prisma.team.findFirst({
      where: {
        id: team_id,
      },
    });

    if (!team) {
      throw new AppError("Team not found");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found");
    }

    const member = await prisma.teamMember.findFirst({
      where: {
        userId: user_id,
        teamId: team_id,
      },
    });

    if (!member) {
      throw new AppError("User does not belong to this team");
    }

    await prisma.teamMember.delete({
      where: {
        id: member.id,
      },
    });

    return response.status(204).end();
  }
}

export { TeamMembersController };
