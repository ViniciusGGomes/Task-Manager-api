import { Request, Response } from "express";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TaskHistoryController {
  async index(request: Request, response: Response) {
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

    const taskHistory = await prisma.taskHistory.findMany({
      where: { taskId: task_id },
      select: {
        id: true,
        taskId: true,
        changedBy: true,
        oldStatus: true,
        newStatus: true,
        changedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!taskHistory || taskHistory.length === 0) {
      throw new AppError("No history found for this task");
    }

    return response.json({ taskHistory });
  }
}

export { TaskHistoryController };
