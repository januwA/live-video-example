import { Module } from '@nestjs/common';
import { LiveGateway } from './live.gateway';
import { SocketIoMessageGateway } from './socket-io-message.gateway';
import { P2PGateway } from './p2p.gateway';
import { AudioGateway } from './audio.gateway';

@Module({
  providers: [LiveGateway, SocketIoMessageGateway, P2PGateway, AudioGateway],
})
export class LiveModule {}
