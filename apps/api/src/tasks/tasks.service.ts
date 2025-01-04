import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  async create(currentUser: User, createTaskDto: CreateTaskDto) {
    const isoDate = new Date(createTaskDto.startDate).toISOString();
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        startDate: isoDate,
        user: {
          connect: { id: currentUser.id },
        },
        owner: {
          connect: { id: currentUser.id },
        },
      },
    });
    return task;
  }

  findAll() {
    return this.prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, currentUser: User) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (task.ownerId !== currentUser.id && task.userId !== currentUser.id) {
      throw new ForbiddenException('You are not allowed to update this task');
    }
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, currentUser: User) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (task.ownerId !== currentUser.id && task.userId !== currentUser.id) {
      throw new ForbiddenException('You are not allowed to delete this task');
    }
    return this.prisma.task.delete({ where: { id } });
  }
}
