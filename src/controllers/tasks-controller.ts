import { Request, Response } from "express";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().min(2),
      description: z.string().min(5),
      status: z.enum(["pending", "in_progress", "completed"]),
      priority: z.enum(["high", "medium", "low"]),
      assigned_to: z.string().uuid(),
      team_id: z.string().uuid(),
    });

    const { title, description, status, priority, assigned_to, team_id } =
      bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        id: assigned_to,
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

    const members = await prisma.teamMember.findFirst({
      where: {
        userId: assigned_to,
        teamId: team_id,
      },
    });

    if (!members) {
      throw new AppError("User does not belong to this team");
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo: assigned_to,
        teamId: team_id,
      },
    });

    return response.status(201).json({ task });
  }

  async index(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found");
    }

    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: user_id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        team: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tasks || tasks.length === 0) {
      throw new AppError("No tasks found for this user");
    }

    return response.json(tasks);
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
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new AppError("Team not found");
    }

    const tasks = await prisma.task.findMany({
      where: {
        teamId: team_id,
      },
    });

    if (!tasks || tasks.length === 0) {
      throw new AppError("No tasks found for this Team");
    }

    return response.json(team);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id } = paramsSchema.parse(request.params);

    const task = await prisma.task.findFirst({
      where: {
        id: task_id,
      },
    });

    if (!task) {
      throw new AppError("Task not found");
    }

    const role = request.user?.role;

    if (role === "member") {
      const bodySchema = z.object({
        status: z.enum(["pending", "in_progress", "completed"]),
      });

      const { status } = bodySchema.parse(request.body);

      if (task.status === status) {
        throw new AppError("No changes detected to update the task");
      }

      await prisma.task.update({
        where: {
          id: task_id,
        },
        data: {
          status,
        },
      });

      if (request.user?.id) {
        await prisma.taskHistory.create({
          data: {
            taskId: task_id,
            changedBy: request.user?.id,
            oldStatus: task.status,
            newStatus: status,
          },
        });
      }
    }

    if (role === "admin") {
      const bodySchema = z.object({
        title: z.string().min(2).optional(),
        description: z.string().min(5).optional(),
        status: z.enum(["pending", "in_progress", "completed"]).optional(),
        priority: z.enum(["high", "medium", "low"]).optional(),
        assigned_to: z.string().uuid().optional(),
        team_id: z.string().uuid().optional(),
      });

      const { title, description, status, priority, assigned_to, team_id } =
        bodySchema.parse(request.body);

      if (
        (!title || task.title === title) &&
        (!description || task.description === description) &&
        (!status || task.status === status) &&
        (!priority || task.priority === priority) &&
        (!assigned_to || task.assignedTo === assigned_to) &&
        (!team_id || task.teamId === team_id)
      ) {
        throw new AppError("No changes detected to update the task");
      }

      if (assigned_to) {
        const user = await prisma.user.findFirst({
          where: { id: assigned_to },
        });
        if (!user) throw new AppError("User not found");
      }

      if (team_id) {
        const team = await prisma.team.findFirst({ where: { id: team_id } });
        if (!team) throw new AppError("Team not found");

        if (assigned_to) {
          const member = await prisma.teamMember.findFirst({
            where: {
              userId: assigned_to,
              teamId: team_id,
            },
          });
          if (!member) throw new AppError("User does not belong to this team");
        }
      }

      await prisma.task.update({
        where: {
          id: task_id,
        },
        data: {
          title,
          description,
          status,
          priority,
          assignedTo: assigned_to,
          teamId: team_id,
        },
      });

      if(status && task.status !== status){
        await prisma.taskHistory.create({
          data: {
            taskId: task_id,
            changedBy: request.user?.id!,
            oldStatus: task.status,
            newStatus: status,
          },
        })
      }
    }

    return response.status(204).end();
  }

  async remove(request: Request, response: Response) {
    const bodySchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id } = bodySchema.parse(request.body);

    const task = await prisma.task.findFirst({
      where: {
        id: task_id,
      },
    });

    if (!task) {
      throw new AppError("Task not found");
    }

    await prisma.task.delete({
      where: {
        id: task_id,
      },
    });

    return response.status(204).end();
  }
}

export { TasksController };
