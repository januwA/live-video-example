import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MESSAGE_EVENT, JOINED_EVENT } from '@live-video-example/p2p';

const KROOM: string = 'audio';

@WebSocketGateway({ namespace: 'audio' })
export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;

  handleDisconnect(client: Socket) {
    const room = this.server.adapter.rooms[KROOM];
    client.leave(KROOM);
    this.server.in(KROOM).emit(JOINED_EVENT, { count: room ? room.length : 0 });
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.join(KROOM);
    this.server
      .in(KROOM)
      .emit(JOINED_EVENT, { count: this.server.adapter.rooms[KROOM].length });
  }

  @SubscribeMessage(MESSAGE_EVENT)
  onMessage(client: Socket, payload: any): any {
    client.to(KROOM).emit(MESSAGE_EVENT, payload);
  }
}
