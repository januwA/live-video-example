import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
import { WebrtcP2pSharedDesktopComponent } from './pages/webrtc-p2p-shared-desktop/webrtc-p2p-shared-desktop.component';
import { WebrtcP2pMediaControlComponent } from './pages/webrtc-p2p-media-control/webrtc-p2p-media-control.component';
import { WebrtcDataChannelComponent } from './pages/webrtc-data-channel/webrtc-data-channel.component';
import { SendAudioComponent } from './pages/send-audio/send-audio.component';

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
    WebrtcP2pSharedDesktopComponent,
    WebrtcP2pMediaControlComponent,
    WebrtcDataChannelComponent,
    SendAudioComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
