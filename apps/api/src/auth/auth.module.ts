import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GenerateTokenProvider,
    JwtStrategy
  ],
})
export class AuthModule { }

