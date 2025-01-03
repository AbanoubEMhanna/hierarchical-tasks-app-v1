import { Global, Module } from '@nestjs/common';
import { AppGateway } from './gateways/app.gateway';

@Global()
@Module({
  imports: [],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class GlobalModule {}

