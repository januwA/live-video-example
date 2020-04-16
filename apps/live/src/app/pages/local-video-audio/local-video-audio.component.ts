import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-local-video-audio',
  templateUrl: './local-video-audio.component.html',
  styleUrls: ['./local-video-audio.component.styl'],
})
export class LocalVideoAudioComponent implements OnInit, AfterViewInit {
  @ViewChild('video')
  videoRef: ElementRef;

  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  localStream: MediaStream;

  get filters(): string[] {
    return Object.keys(this.filtersEvent);
  }

  setVideoFilter(v: string) {
    this.videoRef.nativeElement.style['filter'] = v;
  }

  filtersEvent = {
    none: () => {
      this.setVideoFilter('none');
    },
    blur: () => {
      this.setVideoFilter('blur(1px)');
    },
    brightness: () => {
      this.setVideoFilter('brightness(0.4);');
    },
    contrast: () => {
      this.setVideoFilter('contrast(200%)');
    },
    'drop-shadow': () => {
      this.setVideoFilter('drop-shadow(16px 16px 20px blue)');
    },
    invert: () => {
      this.setVideoFilter('invert(75%)');
    },
    'hue-rotate': () => {
      this.setVideoFilter('hue-rotate(90deg)');
    },
    grayscale: () => {
      this.setVideoFilter('grayscale(50%)');
    },
  };

  async ngOnInit() {
    try {
      this.localStream = await this.mediaDevicesService.getUserMedia();
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

  /**
   * https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter
   * 可以用filter做一些特效
   * @param v
   */
  change(v: string) {
    this.filtersEvent[v]();
  }
}
