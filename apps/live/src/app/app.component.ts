import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';
import { Message } from '@live-video-example/api-interfaces';
import { MediaDevicesService } from './media-devices.service';

declare const MediaRecorder: any;

@Component({
  selector: 'live-video-example-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
})
export class AppComponent implements OnInit {
  constructor(public readonly mediaDevicesService: MediaDevicesService) {}
  @ViewChild('list')
  listRef: ElementRef;

  @ViewChild('live')
  liveRef: ElementRef;

  private _socket: any;

  private _id: string;

  /**
   * 消息列表
   */
  messgaes: Message[] = [];

  /**
   * 所有连接客服端
   */
  clients = new Map<string, any[]>();

  /**
   * 总连接人数
   */
  clientsCount: string = '0';

  message$ = new BehaviorSubject<string>('');

  get listEl(): HTMLElement {
    return this.listRef.nativeElement;
  }

  get offsetY(): number {
    return this.listEl.scrollHeight - this.listEl.offsetHeight;
  }

  async ngOnInit() {
    // this._initSocket();
    // this._initMessage();
    // this._initLiveVideo();
  }

  /**
   * 初始化摄像头
   */
  private async _initLiveVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia#%E5%8F%82%E6%95%B0
      audio: false,
      video: { width: 300, height: 300 },
    });
    // this.liveVideos.push({ srcObject: stream });
    // const mediaRecorder = new MediaRecorder(stream);
    // 10 时间片
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/start
    // mediaRecorder.start(10);
    // mediaRecorder.addEventListener('dataavailable', (e) => {
    //   if (e.data.size <= 0) return;
    // const blob = new Blob([e.data], {
    //   type: 'video/webm',
    // });
    // this._socket.emit('messages', {
    //   message: blob,
    //   status: 2,
    //   id: this._id,
    // });
    // });

    // mediaRecorder.addEventListener('error', (e) => {
    //   console.log('error');
    // });
  }

  /**
   * 初始化发送messages时的流
   */
  private _initMessage() {
    this.message$
      .pipe(
        filter((t) => !!t),
        throttleTime(500)
      )
      .subscribe((message) => {
        this._socket.emit('messages', { message, id: this._id });
      });
  }

  private _initSocket() {
    if (!this._socket) {
      this._socket = io('http://localhost:3333/live');
    }

    // 监听连接服务器成功
    this._socket.on('connect', () => {
      // 发送进入事件
      this._socket.emit('join', null, (clientId) => {
        console.log(clientId);
        this._id = clientId;
      });
    });

    // 订阅messages事件
    this._socket.on('messages', (data: Message) => {
      this.messgaes.push(data);
      this._updateScrollY();
    });

    // 订阅live事件
    this._socket.on('live', (data: Message) => {
      console.log(data);
    });

    // 订阅join事件
    this._socket.on('join', (data: Message) => {
      this.clientsCount = data.message;
      this.clients.set(data.id, []);
    });

    // 订阅disconnect事件
    this._socket.on('disconnect', (data: Message) => {
      this.clientsCount = data.message;
      this.clients.delete(data.id);
    });
  }

  /**
   * 更新messages的滚动条
   */
  private _updateScrollY() {
    let id = setTimeout(() => {
      this.listEl.scroll({
        top: this.offsetY,
        left: 0,
        behavior: 'smooth',
      });
      clearTimeout(id);
    });
  }

  /**
   * 发送消息
   * @param msg
   */
  send(value: string): void {
    this.message$.next(value);
  }

  ngOnDestroy() {
    this.message$.unsubscribe();
  }
}
