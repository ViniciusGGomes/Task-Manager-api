import { Request, Response } from "express";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(2).trim(),
      description: z.string().min(5).trim(),
    });

    const { name, description } = bodySchema.parse(request.body);

    const teamWithSameName = await prisma.team.findFirst({
      where: {
        name,
      },
    });

    if (teamWithSameName) {
      throw new AppError("This Team name is already in use");
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    return response.status(201).json({ team });
  }

  async index(request: Request, response: Response) {
    const team = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.json({ teams: team });
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.string().uuid(),
    });

    const { team_id } = paramsSchema.parse(request.params);

    const team = await prisma.team.findFirst({
      where: {
        id: team_id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        TeamMember: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                task: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new AppError("Team not found");
    }

    return response.json({ team });
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      id: z.string().uuid(),
      name: z.string().min(2).trim(),
      description: z.string().trim(),
    });

    const { name, description, id } = bodySchema.parse(request.body);

    const team = await prisma.team.findFirst({ where: { id } });

    if (!team) {
      throw new AppError("Team not found");
    }

    const teamWithSameName = await prisma.team.findFirst({ where: { name } });

    if (teamWithSameName && teamWithSameName.id !== team.id) {
      throw new AppError("This Team name is already in use");
    }

    if (team.name === name && team.description === description) {
      throw new AppError("No changes detected to update the team");
    }

    await prisma.team.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return response.status(204).end();
  }

  async remove(request: Request, response: Response) {
    const bodySchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = bodySchema.parse(request.body);

    const team = await prisma.team.findFirst({
      where: {
        id,
      },
    });

    if (!team) {
      throw new AppError("Team not found");
    }

    await prisma.team.delete({
      where: {
        id,
      },
    });

    return response.status(204).end();
  }
}

export { TeamsController };
