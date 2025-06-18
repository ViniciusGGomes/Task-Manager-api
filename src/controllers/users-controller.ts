import { Request, Response } from "express";
import z from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email().toLowerCase(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const passwordWithHash = await hash(password, 8);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Email is already in use");
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordWithHash,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json(userWithoutPassword);
  }
}

export { UsersController };
