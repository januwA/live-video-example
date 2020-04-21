import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';
import * as io from 'socket.io-client';
import {
  MESSAGE_EVENT,
  JOINED_EVENT,
  LEAVE_EVENT,
  LEAVED_EVENT,
} from '@live-video-example/p2p';
import { bindLongEvent } from 'apps/live/src/utils';

export interface IAudioMessage {
  self: boolean;
  audioBlob: Blob;
}

@Component({
  selector: 'live-video-example-send-audio',
  templateUrl: './send-audio.component.html',
  styleUrls: ['./send-audio.component.styl'],
})
export class SendAudioComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  @ViewChild('playAudio')
  playAudioRef: ElementRef<HTMLAudioElement>;

  @ViewChild('longButton')
  longButtonRef: ElementRef<HTMLButtonElement>;

  count = 0;
  audios: IAudioMessage[] = [];

  private audioType = 'audio/mp3; codecs=opus';
  private localStream: MediaStream;
  private mr: MediaRecorder;
  private recordedChunks: any[] = [];

  private get audioBlob() {
    return new Blob(this.recordedChunks, {
      type: this.audioType,
    });
  }
  private socket?: SocketIOClient.Socket;

  async ngOnInit() {
    this.localStream = await this.mediaDevicesService.getUserMedia({
      audio: true,
    });
    await this._initSocket();
    await this._initMr();

    // 监听audio播放完毕事件
    this.playAudioRef.nativeElement.addEventListener('ended', () => {
      console.log('语音播放完毕.');
    });
  }

  /**
   * 为按钮绑定长按事件
   */
  ngAfterViewInit(): void {
    bindLongEvent(this.longButtonRef.nativeElement, () => {
      window.navigator.vibrate([200, 100]);
      this.mr.start();
    });
  }

  /**
   * 清理资源
   */
  ngOnDestroy(): void {
    this.socket.disconnect();
    this.socket = null;

    this.localStream?.getTracks().forEach((it) => it.stop());
    this.localStream = null;
  }

  private _initSocket() {
    this.socket = io(`https://dev.ajanuw.com:3333/audio`);

    this.socket.on(JOINED_EVENT, (data) => {
      this.count = data.count;
    });

    this.socket.on(LEAVED_EVENT, (data) => {
      this.count = data.count;
    });

    this.socket.on(MESSAGE_EVENT, (data) => {
      console.log(data);
      this.audios.push({
        self: false,
        audioBlob: new Blob([data.audioBlob]),
      });
    });
  }

  private async _initMr() {
    this.mr = new MediaRecorder(this.localStream);
    this.mr.addEventListener('dataavailable', (e: any) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    });

    this.mr.addEventListener('stop', () => {
      if (!this.socket) return;
      this.audios.push({ self: true, audioBlob: this.audioBlob });
      this.socket.emit(MESSAGE_EVENT, {
        audioBlob: this.audioBlob,
      });
    });
  }

  stop() {
    this.mr.stop();
  }

  play(audioMsg: IAudioMessage) {
    this.playAudioRef.nativeElement.src = URL.createObjectURL(
      audioMsg.audioBlob
    );
    this.playAudioRef.nativeElement.play();
  }
}
