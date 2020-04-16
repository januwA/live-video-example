import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Room, Rooms, Socket } from 'socket.io';
import {
  IJoinData,
  ISendMessage,
  IJoinedData,
  ILeavedData,
} from '@live-video-example/api-interfaces';

/**
 * namespace配置对应io.of('/my-namespace');
 */
@WebSocketGateway({ namespace: 'socket-io-message' })
export class SocketIoMessage
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;

  /**
   * 在网关上断开
   *
   * 当客户端调用`socket.disconnect()`时触发
   *
   * @param client
   */
  handleDisconnect(client: Socket) {
    // console.log('离开了');
  }
  /**
   * 这个钩子类似 io.on('connection', (socket) => ...);
   *
   * 当客户端调用 io('https://dev.ajanuw.com:3333/socket-io-message') 首次连接时触发
   *
   * @param client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    // console.log('a user join');
  }

  /**
   * 加入房间
   * @param client
   * @param payload
   */
  @SubscribeMessage('join')
  onJoin(client: Socket, data: IJoinData): Observable<WsResponse<any>> | any {
    // 手动加入具体的房间, 如果房间不存在，将自动创建
    client.join(data.roomName);

    // 加入现在有两个用户，那么数据可能是
    // { ..., rooms: {  user1id: {}, user2id: {}, room-1: {} } }
    // 从上面的数据可以分析出，每个连接的用户其实就是一个房间，默认就只有一人
    // room-1是join进去的默认房间
    // console.log(this.server.adapter);

    const rooms: Rooms = this.server.adapter.rooms;
    const room: Room = rooms[data.roomName];

    // 当前连接人数
    const userCount = room.length;

    const resultData: IJoinedData = {
      id: client.id,
      username: data.username,
      roomName: data.roomName,
      userCount,
    };

    // 向指定房间的所有人发消息
    this.server.in(data.roomName).emit('joined', resultData);

    /**
     * ==================
     * 回复消息的几种方式
     * ==================
     */

    // 1. 只给当前的用户回复
    // 用户需要监听joined事件
    // client.emit('joined', resultData);

    // 2. 这样返回，用户需要在callback中获取数据
    // `socket.emit('join', 'room-1', callback)`
    // return resultData;

    // 3. 除开本链接，给指定房间内的人发消息
    // client.to(roomName).emit('joined', resultData);

    // 4. 除开本链接外，给所有人发消息
    // client.broadcast.emit('joined', resultData)

    // 5. 给指定房间内的所有人发消息，包括本连接
    // this.server.in(roomName).emit('joined', resultData)

    // 6. 如果返回了一个回调函数，那么客户端可以调用
    // client code: socket.on('joined', (data, fn) => { fn(1) });
    // client.emit('joined', resultData, (r) => ...);

    // 7. 向所有用户发出消息
    // this.server.emit('joined', resultData)
  }

  /**
   * 用户手动调用离开房间
   * @param client
   * @param roomName
   */
  @SubscribeMessage('leave')
  onLeave(
    client: Socket,
    data: ILeavedData
  ): Observable<WsResponse<any>> | any {
    const room = this.server.adapter.rooms[data.roomName];

    // 如果先退出房间，当房间没人时，获取不到length
    const userCount = room.length - 1;

    client.leave(data.roomName);
    const resultData: ILeavedData = {
      userCount,
      id: client.id,
      username: data.username,
      roomName: data.roomName,
    };
    client.broadcast.emit('leaved', resultData);
  }

  @SubscribeMessage('message')
  onMessage(
    client: Socket,
    data: ISendMessage
  ): Observable<WsResponse<any>> | any {
    // 向指定房间的所有人发消息
    this.server.in(data.roomName).emit('message', data);
  }
}
