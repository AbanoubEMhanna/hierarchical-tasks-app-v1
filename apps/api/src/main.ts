import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Swagger } from './common/utils/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true,
  });

  Swagger.setup(app);
  app.setGlobalPrefix('api/v1');

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  const reflector = app.get(Reflector);

  const logger = new Logger('Bootstrap');

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();
  
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `Swagger documentation is available at: http://localhost:${port}/docs`,
  );
}
bootstrap();
