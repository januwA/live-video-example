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

  /**
   * 每当用户进入时
   * @param client
   * @param payload
   */
  @SubscribeMessage('join')
  onJoin(
    client: any,
    payload: Message
  ): Observable<WsResponse<any>> | WsResponse<any> | any {
    const id = client.id;

    this.server.emit('joined', {
      users: Object.keys(this.server.connected),
      id,
      message: this.clientsCount,
    });

    // 当前客户端，断开连接
    // 通知所有客户端，发送Count,和退出客户端的id
    client.on('disconnect', () => {
      this.server.emit('disconnect', {
        id,
        message: this.clientsCount,
        users: Object.keys(this.server.connected),
      });
    });

    return id;
  }

  @SubscribeMessage('live')
  onLive(client: any, payload: Message) {
    this.server.emit('live', payload);
  }

  @SubscribeMessage('offer')
  offer(client: any, payload: any) {
    this.server.emit('offer', payload);
  }

  @SubscribeMessage('answer')
  answer(client: any, payload: any) {
    this.server.emit('answer', payload);
  }
}
