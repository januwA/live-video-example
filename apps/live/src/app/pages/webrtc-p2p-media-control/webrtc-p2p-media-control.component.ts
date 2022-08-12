import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';
import * as io from 'socket.io-client';
import {
  P2P_NAMESPACE,
  JOIN_EVENT,
  FULL_EVENT,
  JOINED_EVENT,
  OTHERJOIN_EVENT,
  LEAVE_EVENT,
  BYE_EVENT,
  LEAVED_EVENT,
  MESSAGE_EVENT,
  IP2PPayload,
  IP2PMessagePayload,
  IP2PResult,
  IP2PMessageResult,
  SERVER_IP,
} from '@live-video-example/p2p';

export enum EConnectState {
  init, // 初始化
  joined, // 连接成功
  joinedConnect, // 与其他人连接成功
  joinedUnbind, // 未绑定状态
  full, // 房间人员已经满了
  leaved, // 退出
}

export const KROOM_NAME = 'room-p2p';

@Component({
  selector: 'live-video-example-webrtc-p2p-media-control',
  templateUrl: './webrtc-p2p-media-control.component.html',
  styleUrls: ['./webrtc-p2p-media-control.component.styl'],
})
export class WebrtcP2pMediaControlComponent implements OnDestroy, OnInit {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}
  ngOnInit(): void {
    let lastResult;
    // 每秒收集一次统计信息
    setInterval(async () => {
      if (!this.pc) return;
      const senders = this.pc.getSenders();
      if (!senders) return;

      const vSender = senders.find((it) => it.track.kind === 'video');
      if (!vSender) return;

      // 提供有关整体连接或指定的统计信息的数据进行解析
      // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/getStats
      const reports = await vSender.getStats();

      //! 端对端完成后才会有数据
      // 这一块没看懂，没写全
      // https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport
      reports.forEach(
        (report: {
          id: string;
          timestamp: number;
          type: string;
          ssrc: number;
          isRemote: boolean;
          mediaType: string;
          kind: string;
          trackId: string;
          transportId: string;
          codecId: string;
          firCount: number;
          pliCount: number;
          nackCount: number;
          qpSum: number;
          mediaSourceId: string;
          packetsSent: number;
          retransmittedPacketsSent: number;
          bytesSent: number;
          headerBytesSent: number;
          retransmittedBytesSent: number;
          framesEncoded: number;
          keyFramesEncoded: number;
          totalEncodeTime: number;
          totalEncodedBytesTarget: number;
          totalPacketSendDelay: number;
          qualityLimitationReason: string;
          qualityLimitationResolutionChanges: number;
          encoderImplementation: string;
        }) => {
          // https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsType
          if (report.type === 'outbound-rtp') {
            // 发送的出站RTP流的统计信息
            if (report.isRemote) return;
            const curTs = report.timestamp;
            const bytes = report.bytesSent;
            const packets = report.packetsSent;
            console.log(JSON.stringify(report, null, 2));
          }
        }
      );
      lastResult = reports;
    }, 1000);
  }
  ngOnDestroy(): void {
    // 离开页面时，销毁流
    this._closePc();
    this._closeLocalStream();
    this._closeRemoteStream();
    this.socket?.disconnect();
  }

  localStream?: MediaStream;
  remoteStream?: MediaStream;

  /**
   * 宽带选择
   */
  bandWidths = ['不限制', '2000', '1000', '500', '200'];

  /**
   * 决定什么时候能够改变宽带
   */
  bandWidthDisabled = true;
  openbandWidthSelect() {
    this.bandWidthDisabled = false;
  }
  closebandWidthSelect() {
    this.bandWidthDisabled = true;
  }

  private connectState: EConnectState = EConnectState.init;
  private socket?: SocketIOClient.Socket;
  private pc?: RTCPeerConnection;

  /**
   * 什么时候能按，连接按钮
   */
  get canPressedConnectButton() {
    return (
      this.connectState === EConnectState.init ||
      this.connectState === EConnectState.leaved
    );
  }

  /**
   * 改变宽带事件
   * @param bw 选择的宽带限制，默认单位是 kb
   */
  async bandWidthChange(bw: string) {
    if (!this.pc) return;
    this.closebandWidthSelect(); // 避免连续改变，设置[setParameters]成功后才能继续改变

    // https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/getSenders
    // 返回一个RTCRtpSender对象数组，每个对象代表负责传输一个轨道的数据的RTP发送方。发送方对象提供了用于检查和控制轨道数据的编码和传输的方法和属性。
    // !一般senders的长度就只有2，一个video，一个audio
    const senders = this.pc.getSenders();
    const vSender = senders.find((it) => it.track.kind === 'video');
    if (!vSender) return console.error('not find vSender');

    // 该对象描述该RTCRtpSender.track属性上媒体的编码和传输的当前配置
    // https://developer.mozilla.org/zh-CN/docs/Web/API/RTCRtpSender/getParameters
    const parameters = vSender.getParameters();

    // !只有在端到端的连接建立完成后，你才能看到encodings里面的数据
    // console.log(parameters.encodings);

    if (!parameters.encodings) parameters.encodings = [{}];
    if (!parameters.encodings.length)
      return console.error(
        `设置失败 encodings: ${parameters.encodings.length}`
      );

    if (bw === '不限制') {
      // 默认为不限制，encoding上没有maxBitrate属性
      delete parameters.encodings[0].maxBitrate;
    } else {
      // !如果强制设置，在chrome上可能出现错误
      // https://stackoverflow.com/questions/57400849/webrtc-change-bandwidth-receiving-invalidmodificationerror-on-chrome
      parameters.encodings[0].maxBitrate = +bw * 1000;
    }

    try {
      await vSender.setParameters(parameters);
      this.openbandWidthSelect();
      console.log(`set maxBitrate ok.`);
    } catch (er) {
      console.error(`set maxBitrate error.`, er);
    }
  }

  /**
   * 1. 打开本地视频流
   * 2. 连接socket服务器
   * 3. 发送join消息
   */
  async connect() {
    // 1
    await this._startLocalStream();

    // 2
    await this._initSocket();

    // 3
    const data: IP2PPayload = {
      roomName: KROOM_NAME,
    };
    this.socket.emit(JOIN_EVENT, data);
  }

  /**
   * 用户点击了退出按钮
   */
  leave() {
    const data: IP2PPayload = {
      roomName: KROOM_NAME,
    };
    this.socket?.emit(LEAVE_EVENT, data);

    // 释放资源
    this._closePc();
    this._closeLocalStream();
    this._closeRemoteStream();
  }

  /**
   * 打开本地视频流
   */
  private async _startLocalStream() {
    try {
      this.localStream = await this.mediaDevicesService.getUserMedia({
        video: {
          width: 320,
          height: 240,
        },
        audio: true,
      });
    } catch (er) {
      console.error(er);
    }
  }

  /**
   * 初始化与socket服务器的连接
   */
  private _initSocket() {
    this.socket = io(`${SERVER_IP}/${P2P_NAMESPACE}`);

    this.socket.on(JOINED_EVENT, (data: IP2PResult) => {
      this.connectState = EConnectState.joined;

      // 进入房间后创建pc
      this._createPc();
    });

    this.socket.on(OTHERJOIN_EVENT, (data: IP2PResult) => {
      if (this.connectState === EConnectState.joinedUnbind) {
        this._createPc();
      }

      // 其他进入房间后，开始媒体协商
      this.connectState = EConnectState.joinedConnect;
      this._call();
    });

    this.socket.on(FULL_EVENT, (data: IP2PResult) => {
      // 收到房间满了的消息，直接退出
      this.connectState = EConnectState.leaved;
      this.socket?.disconnect();
      alert('房间人员满了');
    });

    this.socket.on(BYE_EVENT, (data: IP2PResult) => {
      // 别人离开后，自己处于未绑定状态
      this.connectState = EConnectState.joinedUnbind;
      this._closePc();
    });

    this.socket.on(LEAVED_EVENT, (data: IP2PResult) => {
      // 自己退出，断开连接
      this.connectState = EConnectState.leaved;
      this.socket?.disconnect();
    });

    this.socket.on(
      MESSAGE_EVENT,
      async ({ roomName, message }: IP2PMessageResult) => {
        switch (message.type) {
          case 'offer':
            // 收到远端offer准备完毕的信息
            await this.pc.setRemoteDescription(
              new RTCSessionDescription(message) // 从远端发来的数据，需要从新构造下
            );
            const answer = await this.pc.createAnswer();
            this.openbandWidthSelect();
            await this.pc.setLocalDescription(answer);

            // 发消息给远端, answer已经准备好了
            this._postMessage(answer);
            break;

          case 'answer':
            // 收到远端answer准备完毕的信息
            this.openbandWidthSelect();
            await this.pc.setRemoteDescription(
              new RTCSessionDescription(message)
            );
            break;

          case 'candidate':
            const candidate = new RTCIceCandidate({
              sdpMLineIndex: message.label,
              candidate: message.candidate,
            });
            this.pc.addIceCandidate(candidate);
            break;

          default:
            console.log('其他无法处理的message');
            break;
        }
      }
    );
  }

  private async _call() {
    if (
      !this.pc ||
      !this.socket ||
      this.connectState !== EConnectState.joinedConnect
    )
      return;

    // 1. 创建本端offer
    const offer = await this.pc.createOffer({
      // iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    // 2. 本端收集candidate
    await this.pc.setLocalDescription(offer);

    // 3. 告诉远端，我的offer已经准备好了
    this._postMessage(offer);
  }

  /**
   * 关闭本地媒体流
   */
  private _closeLocalStream() {
    this.localStream?.getTracks().forEach((strck) => {
      strck.stop();
    });
    this.localStream = null;
  }

  private _closeRemoteStream() {
    this.remoteStream?.getTracks().forEach((strck) => {
      strck.stop();
    });
    this.remoteStream = null;
  }

  /**
   * 挂断, 销毁流
   */
  private _closePc() {
    this.pc?.close();
    this.pc = null;
  }

  private _createPc() {
    if (!this.pc) {
      const pcConfig = {
        iceServers: [
          {
            // https://www.jianshu.com/p/0943038b51de
            urls: 'stun:stun1.l.google.com:19302',
          },
        ],
      };
      this.pc = new RTCPeerConnection(pcConfig);

      this.pc.onicecandidate = (e) => {
        if (e.candidate) {
          // console.log(e.candidate);
          this._postMessage({
            type: 'candidate',
            label: e.candidate.sdpMLineIndex,
            id: e.candidate.sdpMid,
            candidate: e.candidate.candidate,
          });
        }
      };

      // 如果远端有数据过来，那么将收到ontrack事件，那么直接将里面的流放在video上播放
      this.pc.ontrack = (e) => {
        if (e.streams.length) {
          this.remoteStream = e.streams[0];
        }
      };
    }

    this.localStream?.getTracks().forEach((track) => {
      this.pc?.addTrack(track, this.localStream);
    });
  }

  private _postMessage(message: any) {
    const data: IP2PMessagePayload = {
      roomName: KROOM_NAME,
      message: message,
    };
    this.socket?.emit(MESSAGE_EVENT, data);
  }
}
