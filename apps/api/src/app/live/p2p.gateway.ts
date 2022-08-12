import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Room, Socket } from 'socket.io';
import {
  P2P_NAMESPACE,
  JOIN_EVENT,
  FULL_EVENT,
  JOINED_EVENT,
  OTHERJOIN_EVENT,
  LEAVE_EVENT,
  BYE_EVENT,
  LEAVED_EVENT,
  MESSAGE_EVENT,
  IP2PPayload,
  IP2PMessagePayload,
  IP2PResult,
} from '@live-video-example/p2p';
/**
 * 一对一只能有两人
 */
export const MAX_USER_COUNT = 2;

@WebSocketGateway({ namespace: P2P_NAMESPACE })
export class P2PGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
   * 当客户端调用 io('http://localhost:3333/socket-io-message') 首次连接时触发
   *
   * @param client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    // console.log('a user join');
  }

  /**
   * 用户加入房间
   *
   * 一个房间最多两人，当第三个人加入将回复`full`消息(人数已满)
   *
   * 加入房间成功后，将收到`joined`消息
   *
   * 当第二个人加入房间后，第一个人将收到`otherjoin`消息
   *
   * @param client
   * @param payload
   */
  @SubscribeMessage(JOIN_EVENT)
  onJoin(client: Socket, payload: IP2PPayload): any {
    // 将用户加入房间
    client.join(payload.roomName);

    // 获取房间
    const room: Room = this.server.adapter.rooms[payload.roomName];

    // 当前房间人数
    const userCount = room.length;

    const resultData: IP2PResult = {
      id: client.id,
      roomName: payload.roomName,
      userCount,
    };

    if (userCount > MAX_USER_COUNT) {
      // 人数过多，踢掉
      client.leave(payload.roomName);
      client.emit(FULL_EVENT, resultData);
      return;
    }

    // 回复当前连接的用户,加入ok
    client.emit(JOINED_EVENT, resultData);

    // 如果当前房间已经有人了，那么就给这些人发送提示消息，有人加入
    if (userCount > 1) {
      client.to(payload.roomName).emit(OTHERJOIN_EVENT, resultData);
    }
  }

  /**
   * 用户手动调用离开房间
   * @param client
   * @param roomName
   */
  @SubscribeMessage(LEAVE_EVENT)
  onLeave(client: Socket, payload: IP2PPayload): any {
    // 获取房间
    const room: Room = this.server.adapter.rooms[payload.roomName];

    // 当前房间人数
    const userCount = room.length;

    const resultData: IP2PResult = {
      id: client.id,
      roomName: payload.roomName,
      userCount,
    };

    // 给房间内的其他人发送bye消息
    client.to(payload.roomName).emit(BYE_EVENT, resultData);

    // 给自己发送，退出消息
    client.emit(LEAVED_EVENT, resultData);
  }

  @SubscribeMessage(MESSAGE_EVENT)
  onMessage(client: Socket, payload: IP2PMessagePayload): any {
    // 将消息原封不动的，转发给房间内的其他人
    client.to(payload.roomName).emit(MESSAGE_EVENT, payload);
  }
}
