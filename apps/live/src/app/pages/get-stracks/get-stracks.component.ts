import { Component, OnInit, ViewChild, ElementRef, Pipe } from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-get-stracks',
  templateUrl: './get-stracks.component.html',
  styleUrls: ['./get-stracks.component.styl'],
})
export class GetStracksComponent implements OnInit {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  @ViewChild('video')
  videoRef: ElementRef<HTMLVideoElement>;

  localStream: MediaStream;

  get videoStracks(): MediaTrackSettings[] {
    if (!this.localStream) return [];
    const videoStracks: MediaStreamTrack[] = this.localStream.getVideoTracks();

    // 获取每个轨的设置
    const settings: MediaTrackSettings[] = videoStracks.map((it) =>
      it.getSettings()
    );
    return settings;
  }

  async ngOnInit() {
    try {
      this.localStream = await this.mediaDevicesService.getUserMedia({
        audio: true,
        video: {
          width: 320,
          height: 240,
        },
      });
      this.ngAfterViewInit();
    } catch (er) {
      console.error(er);
    }
  }

  ngAfterViewInit(): void {
    if (this.localStream) {
      this.videoRef.nativeElement.srcObject = this.localStream;
    }
  }
}
