import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) { }
  async create(currentUser: User, createTaskDto: CreateTaskDto) {
    const isoDate = new Date(createTaskDto.startDate).toISOString();
    const task = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        startDate: isoDate,
        parentId: createTaskDto.parentId || null,
        userId: currentUser.id,
        ownerId: currentUser.id,
        completionPercentage: createTaskDto.completionPercentage,
      },
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
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            completionPercentage: true,
          },
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
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            completionPercentage: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            completionPercentage: true,
            parentId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
        }
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
    let updateTaskData = {
      ...updateTaskDto,
      startDate: updateTaskDto.startDate ? new Date(updateTaskDto.startDate).toISOString() : undefined,
    };
    return this.prisma.task.update({
      where: { id },
      data: updateTaskData,
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

  async remove(id: number, currentUser: User) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    console.log("🚀 ~ TasksService ~ remove ~ task:", task)
    if (task.ownerId !== currentUser.id && task.userId !== currentUser.id) {
      throw new ForbiddenException('You are not allowed to delete this task');
    }
    return this.prisma.task.delete({ where: { id } });
  }
}
