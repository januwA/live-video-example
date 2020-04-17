import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnumerateDevicesComponent } from './pages/enumerate-devices/enumerate-devices.component';
import { DashComponent } from './pages/dash/dash.component';
import { LocalVideoAudioComponent } from './pages/local-video-audio/local-video-audio.component';
import { GetImageInVideoComponent } from './pages/get-image-in-video/get-image-in-video.component';
import { GetAudioComponent } from './pages/get-audio/get-audio.component';
import { GetStracksComponent } from './pages/get-stracks/get-stracks.component';
import { RecordAudioAndVideoComponent } from './pages/record-audio-and-video/record-audio-and-video.component';
import { RecordDesktopComponent } from './pages/record-desktop/record-desktop.component';
import { SocketIoMessageComponent } from './pages/socket-io-message/socket-io-message.component';
import { WebrtcP2pComponent } from './pages/webrtc-p2p/webrtc-p2p.component';
import { LocalP2pComponent } from './pages/local-p2p/local-p2p.component';

const routes: Routes = [
  {
    path: '',
    component: DashComponent,
    data: {
      title: 'Examples',
    },
  },
  {
    path: 'enumerate-devices',
    component: EnumerateDevicesComponent,
    data: {
      title: '查看 video audio 设备列表',
    },
  },
  {
    path: 'local-video-audio',
    component: LocalVideoAudioComponent,
    data: {
      title: '本地音视频采集，获取本地音视频流',
    },
  },
  {
    path: 'get-image-in-video',
    component: GetImageInVideoComponent,
    data: {
      title: '本地音视频采集，从视频中获取图像',
    },
  },
  {
    path: 'get-audio',
    component: GetAudioComponent,
    data: {
      title: '只获取音频信息',
    },
  },
  {
    path: 'get-stracks',
    component: GetStracksComponent,
    data: {
      title: '获取视频轨',
    },
  },
  {
    path: 'record-audio-and-video',
    component: RecordAudioAndVideoComponent,
    data: {
      title: '录制音视频',
    },
  },
  {
    path: 'record-desktop',
    component: RecordDesktopComponent,
    data: {
      title: 'WebRTC 捕获桌面',
    },
  },
  {
    path: 'socket-io-message',
    component: SocketIoMessageComponent,
    data: {
      title: '信令服务器 socket.io 发送消息',
    },
  },
  {
    path: 'local-p2p',
    component: LocalP2pComponent,
    data: {
      title: '本地 端对端连接',
    },
  },
  {
    path: 'webrtc-p2p',
    component: WebrtcP2pComponent,
    data: {
      title: 'WebRTC 端对端连接',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
