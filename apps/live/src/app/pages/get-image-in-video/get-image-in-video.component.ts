import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

const w = 320;
const h = 240;

@Component({
  selector: 'live-video-example-get-image-in-video',
  templateUrl: './get-image-in-video.component.html',
  styleUrls: ['./get-image-in-video.component.styl'],
})
export class GetImageInVideoComponent implements OnInit {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}
  
  @ViewChild('video')
  videoRef: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  canvasRef: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  localStream: MediaStream;

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

    this.canvasRef.nativeElement.width = w;
    this.canvasRef.nativeElement.height = h;
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    // 基点默认在 0,0
    this.ctx.translate(w / 2, h / 2);
    this.ctx.scale(-1, 1);
  }

  /**
   * 使用canvas来对视频进行截图
   *
   * https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage
   */
  getImage() {
    console.log('click');

    this.ctx.drawImage(this.videoRef.nativeElement, -w * 0.5, -h * 0.5, w, h);

    // const img = document.createElement('img');
    // img.width = this.canvasRef.nativeElement.width;
    // img.height = this.canvasRef.nativeElement.height;
    // img.src = this.canvasRef.nativeElement.toDataURL('image/png');
    // document.body.append(img);
  }
}
