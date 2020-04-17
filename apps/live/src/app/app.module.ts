import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
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

@NgModule({
  declarations: [
    AppComponent,
    EnumerateDevicesComponent,
    DashComponent,
    LocalVideoAudioComponent,
    GetImageInVideoComponent,
    GetAudioComponent,
    GetStracksComponent,
    RecordAudioAndVideoComponent,
    RecordDesktopComponent,
    SocketIoMessageComponent,
    WebrtcP2pComponent,
    LocalP2pComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
