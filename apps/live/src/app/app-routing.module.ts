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

const routes: Routes = [
  {
    path: '',
    component: DashComponent,
  },
  {
    path: 'enumerate-devices',
    component: EnumerateDevicesComponent,
  },
  {
    path: 'local-video-audio',
    component: LocalVideoAudioComponent,
  },
  {
    path: 'get-image-in-video',
    component: GetImageInVideoComponent,
  },
  {
    path: 'get-audio',
    component: GetAudioComponent,
  },
  {
    path: 'get-stracks',
    component: GetStracksComponent,
  },
  {
    path: 'record-audio-and-video',
    component: RecordAudioAndVideoComponent,
  },
  {
    path: 'record-desktop',
    component: RecordDesktopComponent,
  },
  {
    path: 'socket-io-message',
    component: SocketIoMessageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
