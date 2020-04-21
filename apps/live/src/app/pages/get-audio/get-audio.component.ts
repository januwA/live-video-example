import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-get-audio',
  templateUrl: './get-audio.component.html',
  styleUrls: ['./get-audio.component.styl'],
})
export class GetAudioComponent implements OnInit, OnDestroy {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  @ViewChild('audio')
  audioRef: ElementRef<HTMLAudioElement>;

  localStream: MediaStream;
  mr: MediaRecorder;
  recordedChunks: any[] = [];

  isStart = false;

  async ngOnInit() {
    await this._initLocalStream();
    await this._initMr();
  }
  ngOnDestroy(): void {
    this.mr = null;
    this.localStream = null;
  }

  private async _initLocalStream() {
    this.localStream = await this.mediaDevicesService.getUserMedia({
      audio: true,
    });
    this.audioRef.nativeElement.srcObject = this.localStream;
  }

  private async _initMr() {
    this.mr = new MediaRecorder(this.localStream);
    this.mr.addEventListener('dataavailable', (e: any) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    });

    this.mr.addEventListener('stop', () => {
      const type = 'audio/mp3; codecs=opus';
      const blob = new Blob(this.recordedChunks, {
        type,
      });
      this.saveFile(blob);
    });
  }

  saveFile(blob: Blob) {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'acetest.mp3';
    downloadLink.click();
  }

  download() {
    this.isStart = false;
    this.mr.stop();
  }

  start() {
    this.isStart = true;

    this.mr.start();
  }
}
