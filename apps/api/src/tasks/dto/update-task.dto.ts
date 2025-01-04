import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsString, IsBoolean, IsDefined, IsDate, IsNumber } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiPropertyOptional({
        description: 'The name of the task',
        example: 'Task 1',
    })
    @IsString()
    @IsDefined()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'The start date of the task',
        example: '2021-01-01',
    })
    @IsDate()
    @IsDefined()
    @IsOptional()
    startDate?: Date;

    @ApiPropertyOptional({
        description: 'The completion percentage of the task',
        example: 50,
    })
    @IsNumber()
    @IsDefined()
    @IsOptional()
    completionPercentage?: number;

    @ApiPropertyOptional({
        description: 'The description of the task',
        example: 'This is a task description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'The User id , the user that is assigned to the task',
        example: 1,
    })
    @IsNumber()
    @IsOptional()
    userId?: number;
}