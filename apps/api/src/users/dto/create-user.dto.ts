import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsDefined()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
    })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password',
    })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    password: string;
}