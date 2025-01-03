import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
        type: String,
    })
    @IsEmail()  
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: '1234567890',
        type: String,
    })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    password: string;
}