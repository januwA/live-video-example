import { Injectable } from '@angular/core';

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MediaDevicesService {
  constructor() {}

  /**
   * 请求一个可用的媒体输入和输出设备的列表
   *
   * 例如麦克风，摄像机，耳机设备等
   *
   * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices
   */
  async enumerateDevices(): Promise<MediaDeviceInfo[]> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw '不支持 enumerateDevices() .';
      }
      return await navigator.mediaDevices.enumerateDevices();
    } catch (er) {
      console.error(er);
      throw new Error(`获取设备列表失败`);
    }
  }

  /**
   *  会提示用户给予使用媒体输入的许可，媒体输入会产生一个MediaStream，里面包含了请求的媒体类型的轨道。
   *
   * 此流可以包含一个视频轨道（来自硬件或者虚拟视频源，比如相机、视频采集设备和屏幕共享服务等等）、
   *
   * 一个音频轨道（同样来自硬件或虚拟音频源，比如麦克风、A/D转换器等等），也可能是其它轨道类型。
   * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
   * @param constraints  指定了请求的媒体类型和相对应的参数, 视频宽高，前置摄像头，后置摄像头，视频裁剪
   */
  async getUserMedia(
    constraints: MediaStreamConstraints = {
      audio: true,
      // video: true,
      video: {
        width: 320,
        height: 240,
        // 帧率
        // frameRate: { ideal: 10, max: 15 }
      },
    }
  ): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw '不支持 getUserMedia() .';
    }
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * 提示用户去选择和授权捕获展示的内容或部分内容（如一个窗口）在一个  MediaStream 里.
   *
   * 然后，这个媒体流可以通过使用 MediaStream Recording API 被记录或者作为WebRTC 会话的一部分被传输
   *
   * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getDisplayMedia
   * https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
   * https://www.w3.org/TR/screen-capture/
   * 
   * 开启chrome的实验功能
   * chrome://flags/#enable-experimental-web-platform-features
   * 
   * !录制某些桌面应用可能出现黑屏情况
   */
  async getDisplayMedia(
    constraints: any = { audio: true, video: true }
  ) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw '不支持 getDisplayMedia() .';
    }
    return navigator.mediaDevices.getDisplayMedia(constraints);
  }
}
