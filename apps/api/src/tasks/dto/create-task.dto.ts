import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the task',
    example: 'Implement login feature',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Implement user authentication with JWT',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The ID of the task owner',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @ApiProperty({
    description: 'The start date of the task',
    example: '2024-01-01',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'The completion percentage of the task',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  completionPercentage: number;

  @ApiProperty({
    description: 'The ID of the parent task',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    description: 'The ID of the assigned user',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Custom field values',
    example: { priority: 'High', dueDate: '2024-02-01' },
    required: false,
  })
  @IsOptional()
  customFields?: Record<string, any>;
}
