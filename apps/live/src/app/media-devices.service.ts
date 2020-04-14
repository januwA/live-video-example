import { Injectable } from '@angular/core';

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
}
