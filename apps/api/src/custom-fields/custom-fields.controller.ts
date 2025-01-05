import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Custom Fields')
@ApiBearerAuth()
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldsService.create(createCustomFieldDto);
  }

  @Get()
  findAll() {
    return this.customFieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customFieldsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomFieldDto: UpdateCustomFieldDto) {
    return this.customFieldsService.update(+id, updateCustomFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customFieldsService.remove(+id);
  }
}
