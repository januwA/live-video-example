import { Component, OnInit, OnDestroy } from '@angular/core';

import * as io from 'socket.io-client';
import {
  ISendMessage,
  IJoinedData,
  ILeavedData,
} from '@live-video-example/api-interfaces';

@Component({
  selector: 'live-video-example-socket-io-message',
  templateUrl: './socket-io-message.component.html',
  styleUrls: ['./socket-io-message.component.styl'],
})
export class SocketIoMessageComponent implements OnInit, OnDestroy {
  constructor() {}

  /**
   * 连接后才能聊天
   */
  isConnect: boolean = false;

  userCount: number = 0;

  username: string = '小明';
  roomName: string = 'room-1';

  messgaes: {
    message: string;
    username: string;
  }[] = [];

  socket: SocketIOClient.Socket;

  ngOnInit(): void {}

  /**
   * 清理资源
   */
  ngOnDestroy(): void {
    if (this.socket) {
      this.leave();
      this.socket.close();
    }
  }

  /**
   * 发送消息
   * @param message
   */
  send(message: string) {
    this.socket.emit('message', {
      message,
      username: this.username,
      roomName: this.roomName,
    });
  }

  /**
   * 连接到聊天室
   * @param username
   * @param roomName
   */
  connect() {
    if (!this.username.trim() || !this.roomName.trim()) {
      alert('请输入username和要加入的房间号.');
      return;
    }
    // console.log(this.username, this.roomName);
    this._initSocket();

    this.socket.emit('join', {
      username: this.username,
      roomName: this.roomName,
    });
  }

  /**
   * 退出房间
   */
  leave() {
    this.socket.emit('leave', {
      username: this.username,
      roomName: this.roomName,
    });
    this.userCount = 0;
    this.isConnect = false;
  }

  private _initSocket() {
    if (this.socket) return;
    this.socket = io('https://dev.ajanuw.com:3333/socket-io-message');
    this._initSocketEvents();
  }

  private _initSocketEvents() {
    if (!this.socket) return;
    this.socket.on('connect', () => {
      console.log('socket 连接服务器ok.');
    });

    // 有用户加入房间，自己加入也会收到消息
    this.socket.on(
      'joined',
      ({ id, username, roomName, userCount }: IJoinedData) => {
        if (!this.isConnect) this.isConnect = true;
        console.log(`
        ${username}加入房间${roomName}, 当前房间总人数${userCount}
        `);

        this.userCount = userCount;
      }
    );

    // 有用户离开房间时，自己离开不会收到消息
    this.socket.on(
      'leaved',
      ({ id, username, roomName, userCount }: ILeavedData) => {
        console.log(`
      ${username}离开房间${roomName}, 当前房间总人数${userCount}
      `);
        this.userCount = userCount;
      }
    );

    // 用户发送了消息
    this.socket.on(
      'message',
      ({ username, roomName, message }: ISendMessage) => {
        this.messgaes.push({
          message,
          username,
        });
      }
    );
  }
}
