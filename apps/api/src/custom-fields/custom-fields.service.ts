import { Injectable } from '@nestjs/common';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomFieldsService {
  constructor(private readonly prisma: PrismaService) { }

  create(createCustomFieldDto: CreateCustomFieldDto) {
    return this.prisma.customField.create({
      data: createCustomFieldDto,
    });
  }

  findAll() {
    return this.prisma.customField.findMany();
  }

  findOne(id: number) {
    return this.prisma.customField.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCustomFieldDto: UpdateCustomFieldDto) {
    return this.prisma.customField.update({
      where: { id },
      data: updateCustomFieldDto,
    });
  }

  remove(id: number) {
    return this.prisma.customField.delete({
      where: { id },
    });
  }
}
