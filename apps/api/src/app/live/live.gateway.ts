import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { Message } from '@live-video-example/api-interfaces';

// io.of('/my-namespace');
@WebSocketGateway({ namespace: 'live' })
export class LiveGateway {

  @WebSocketServer() server;

  /**
   * 当前连接人数
   */
  get clientsCount(): number {
    // console.log(this.server);
    // eio.clientsCount // 连接人数
    // eio.clients
    // connected  // 连接中的clients

    // 如果没有加 namespace那么可以直接访问this.server
    // 反之需要 this.server.server
    return this.server.server.eio.clientsCount;
  }

  clients = new Map<string, any[]>();

  @SubscribeMessage('messages')
  onEvent(client: any, payload: Message): Observable<WsResponse<any>> | any {
    // console.log(client);
    // id: 'ZU2onSeItU30ikQzAAAA'
    // rooms: { ZU2onSeItU30ikQzAAAA: 'ZU2onSeItU30ikQzAAAA' },
    // adapter.rooms
    // adapter.sids

    // console.log('==========================');
    // console.log(client.id);
    // console.log(client.rooms);
    // console.log(client.adapter.rooms);
    // console.log(client.adapter.sids);
    // console.log('==========================');
    this.server.emit('messages', payload);
  }

  @SubscribeMessage('join')
  onJoin(
    client: any,
    payload: Message
  ): Observable<WsResponse<any>> | WsResponse<any> | any {
    const id = client.id;
    if (!this.clients.has(id)) {
      this.clients.set(id, []);
    } else {
      console.log('what? the user is exist');
    }
    this.server.emit('join', {
      message: this.clientsCount,
      id,
    });

    // 当前客户端，断开连接
    // 通知所有客户端，发送Count,和退出客户端的id
    client.on('disconnect', () => {
      this.server.emit('disconnect', {
        message: this.clientsCount,
        id,
      });
      this.clients.delete(id);
    });

    return id;
  }

  @SubscribeMessage('live')
  onLive(client: any, payload: Message) {
    console.log(payload);
  }
}
