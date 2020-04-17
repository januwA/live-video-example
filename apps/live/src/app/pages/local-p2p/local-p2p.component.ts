import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-local-p2p',
  templateUrl: './local-p2p.component.html',
  styleUrls: ['./local-p2p.component.styl'],
})
export class LocalP2pComponent implements OnInit, OnDestroy {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}

  @ViewChild('localVideo')
  localVideoRef: ElementRef<HTMLVideoElement>;

  @ViewChild('remotevideo')
  remotevideoRef: ElementRef<HTMLVideoElement>;

  private localStream: MediaStream;

  private pc1: RTCPeerConnection;
  private pc2: RTCPeerConnection;

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  /**
   * 开始
   */
  async start() {
    try {
      this.localStream = await this.mediaDevicesService.getUserMedia({
        video: {
          width: 320,
          height: 240,
        },
        audio: true,
      });
      this.localVideoRef.nativeElement.srcObject = this.localStream;
    } catch (er) {
      console.error(er);
    }
  }

  /**
   * 连接
   *
   * https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection
   */
  async call() {
    this.pc1 = new RTCPeerConnection();
    this.pc2 = new RTCPeerConnection();

    // 收集交给对方
    this.pc1.onicecandidate = (e) => {
      if (e.candidate) {
        this.pc2.addIceCandidate(e.candidate);
      }
    };

    // 收集交给对方
    this.pc2.onicecandidate = (e) => {
      if (e.candidate) {
        this.pc1.addIceCandidate(e.candidate);
      }
    };

    this.pc2.ontrack = (e) => {
      this.remotevideoRef.nativeElement.srcObject = e.streams[0];
    };

    // this.pc1.addStream(this.localStream);
    // 读取本地流中的所有轨道，添加到localPc
    this.localStream.getTracks().forEach((track) => {
      this.pc1.addTrack(track, this.localStream);
    });

    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
    const offer = await this.pc1.createOffer(offerOptions);

    // 触发 onicecandidate
    await this.pc1.setLocalDescription(offer);

    // 远端收到offer
    await this.pc2.setRemoteDescription(offer);
    const answer = await this.pc2.createAnswer();
    // 触发 onicecandidate
    await this.pc2.setLocalDescription(answer);

    // 设置pc1的远端
    await this.pc1.setRemoteDescription(answer);
  }

  /**
   * 挂断
   */
  hangup() {
    this.pc1?.close();
    this.pc2?.close();
    this.pc1 = null;
    this.pc2 = null;
  }
}
