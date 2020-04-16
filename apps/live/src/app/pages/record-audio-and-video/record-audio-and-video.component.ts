import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-record-audio-and-video',
  templateUrl: './record-audio-and-video.component.html',
  styleUrls: ['./record-audio-and-video.component.styl'],
})
export class RecordAudioAndVideoComponent implements OnInit {
  @ViewChild('video')
  videoRef: ElementRef;

  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  localStream: MediaStream;
  mediaRecorder: MediaRecorder;
  recordedChunks: any[] = [];

  isStart = false;

  async ngOnInit() {
    this.isTypeSupported();
    try {
      this.localStream = await this.mediaDevicesService.getUserMedia({
        audio: true,
        video: true,
      });
      this._initMediaRecorder();
      this.ngAfterViewInit();
    } catch (er) {
      console.error(er);
    }
  }

  /**
   *
   * 创建一个对指定的 MediaStream 进行录制的 MediaRecorder 对象
   *
   * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/MediaRecorder
   */
  _initMediaRecorder() {
    if (!this.localStream) return;
    this.mediaRecorder = new MediaRecorder(this.localStream, {
      mimeType: 'video/webm',
    });
    this.mediaRecorder.addEventListener('dataavailable', (e: any) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    });
    this.mediaRecorder.addEventListener('start', () => {
      console.log('开始录制');
      this.isStart = true;
      this.recordedChunks = [];
    });
    this.mediaRecorder.addEventListener('error', () => {
      console.log('录制发生错误');
    });
    this.mediaRecorder.addEventListener('stop', () => {
      console.log('停止录制');
    });
  }

  ngAfterViewInit(): void {
    if (this.localStream) {
      this.videoRef.nativeElement.srcObject = this.localStream;
    }
  }

  /**
   * 开始将媒体记录到一个或多个Blob对象中
   *
   * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/start
   */
  start() {
    this.mediaRecorder.start();
  }

  stop() {
    this.mediaRecorder.stop();
  }

  /**
   * 暂停媒体流的记录
   *
   * 如果媒体流没有开始，那么将抛出InvalidState错误
   */
  pause() {
    this.mediaRecorder.pause();
  }

  /**
   * 用于在先前已暂停的情况下恢复媒体记录。
   */
  resume() {
    this.mediaRecorder.resume();
  }

  /**
   * 检查本地是否至此某些MIME类型
   */
  isTypeSupported() {
    var types = [
      'video/webm',
      'audio/webm',
      'video/webm;codecs=vp8',
      'video/webm;codecs=daala',
      'video/webm;codecs=h264',
      'audio/webm;codecs=opus',
      'video/mpeg',
    ];

    for (var i in types) {
      console.log(
        `Is ${types[i]} supported? ${
          MediaRecorder.isTypeSupported(types[i]) ? 'Maybe!' : 'Nope :('
        }`
      );
    }
  }

  /**
   * 下载后用浏览器打开视频
   */
  doanload() {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(
      new Blob(this.recordedChunks, {
        type: 'video/webm',
      })
    );
    a.download = 'acetest.webm';
    a.click();
  }
}
