import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Password } from 'src/common/utils/password';
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { AuthResponse } from './interfaces/auth-response';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private _generateTokenProvider: GenerateTokenProvider
    ) { }

    async signIn(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.usersService.findOne({ email: loginDto.email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await Password.isMatch({ password: loginDto.password, hash: user.password });
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken: this._generateTokenProvider.generateAccessToken({ email: user.email, sub: user.id, name: user.name }),
        };
    }

    async signUp(registerDto: RegisterDto): Promise<AuthResponse> {
        const user = await this.usersService.findOne({ email: registerDto.email });
        if (user) {
            throw new ConflictException('User already exists');
        }
        const hashedPassword = await Password.hashPassword(registerDto.password);
        const { password, ...newUser } = await this.usersService.create({ ...registerDto, password: hashedPassword });
        return {
            user: newUser,
            accessToken: this._generateTokenProvider.generateAccessToken({ email: user.email, sub: user.id, name: user.name }),
        };
    }
}
