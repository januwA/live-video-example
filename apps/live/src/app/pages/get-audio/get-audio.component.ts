import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-get-audio',
  templateUrl: './get-audio.component.html',
  styleUrls: ['./get-audio.component.styl'],
})
export class GetAudioComponent implements OnInit {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  @ViewChild('audio')
  audioRef: ElementRef<HTMLAudioElement>;

  localStream: MediaStream;
  mediaRecorder: any;
  recordedChunks: any[] = [];

  async ngOnInit() {
    try {
      this.localStream = await this.mediaDevicesService.getUserMedia({
        video: false,
        audio: true,
      });
      this.ngAfterViewInit();

      if (this.mediaRecorder) return;
      this.mediaRecorder = new MediaRecorder(this.localStream);
      this.mediaRecorder.start();
      this.mediaRecorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob(this.recordedChunks));
        downloadLink.download = 'acetest.mp3';
        downloadLink.click();
      });
    } catch (er) {
      console.error(er);
    }
  }

  ngAfterViewInit(): void {
    if (this.localStream) {
      this.audioRef.nativeElement.srcObject = this.localStream;
    }
  }

  download() {
    this.mediaRecorder.stop();
  }
}
