export const P2P_NAMESPACE = 'p2p';
export const JOIN_EVENT = 'join';
export const FULL_EVENT = 'full';
export const JOINED_EVENT = 'joined';
export const OTHERJOIN_EVENT = 'otherjoin';
export const LEAVE_EVENT = 'leave';
export const BYE_EVENT = 'bye';
export const LEAVED_EVENT = 'leaved';
export const MESSAGE_EVENT = 'message';

export const SERVER_IP = 'http://localhost:3333';

export interface IP2PPayload {
  roomName: string;
}

export interface IP2PMessagePayload extends IP2PPayload {
  message: any;
}

export interface IP2PMessageResult extends IP2PMessagePayload {}

export interface IP2PResult {
  id: string;
  roomName: string;
  userCount: number;
}
