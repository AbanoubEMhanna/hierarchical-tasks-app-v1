import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FieldType } from '@prisma/client';

export class CreateCustomFieldDto {
  @ApiProperty({
    description: 'The name of the custom field',
    example: 'Priority',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The type of the custom field',
    enum: FieldType,
    example: 'TEXT',
  })
  @IsEnum(FieldType)
  @IsNotEmpty()
  type: FieldType;

  @ApiProperty({
    description: 'Options for dropdown type fields',
    example: ['High', 'Medium', 'Low'],
    required: false,
  })
  @IsOptional()
  options?: string[];
}