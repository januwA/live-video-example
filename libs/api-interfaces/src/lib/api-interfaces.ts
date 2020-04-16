export interface Message {
  message: string;

  /**
   * 进入聊天室后返回client.id
   */
  id?: string;
}

/**
 * 加入房间需要发送的数据
 */
export interface IJoinData {
  username: string;
  roomName: string;
}

/**
 * 离开房间需要发送的数据
 */
export interface ILeavedData extends IJoinData {}

/**
 * 发送消息需要发送的数据
 */
export interface ISendMessage {
  message: string;
  username: string;
  roomName: string;
}

/**
 * 加入房间后返回的data
 */
export interface IJoinedData {
  id: string;
  username: string;
  roomName: string;
  userCount: number;
}

/**
 * 有人退出房间返回的data
 */
export interface ILeavedData extends IJoinedData {
 
}
