import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsString } from "class-validator";

export class CreateTaskDto implements Omit<Prisma.TaskCreateInput , 'user' | 'owner'>{
    @ApiProperty({
        description: 'The name of the task',
        example: 'Task 1',
    })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The start date of the task',
        example: '2021-01-01',
    })
    @Type(() => Date)
    @IsDate()
    @IsDefined()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        description: 'The completion percentage of the task',
        example: 50,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    completionPercentage: number;

    @ApiPropertyOptional({
        description: 'The description of the task',
        example: 'This is a task description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'The parent task id',
        example: 1,
    })
    @IsNumber()
    @IsOptional()
    parentId?: number;
}
