import { Module } from '@nestjs/common';
import { LiveGateway } from './live.gateway';
import { SocketIoMessage } from './socket-io-message.gateway';

@Module({
  providers: [LiveGateway, SocketIoMessage],
})
export class LiveModule {}
