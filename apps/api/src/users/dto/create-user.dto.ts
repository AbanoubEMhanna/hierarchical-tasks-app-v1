import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password',
    })
    @IsString()
    password: string;
}
