import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class GenerateTokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
