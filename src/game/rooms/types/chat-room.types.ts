// Types cho client sử dụng khi tương tác với ChatRoom

export interface JoinRoomOptions {
  name?: string;
  roomName?: string;
}

export interface MessageData {
  message: string;
}

export interface ChangeNameData {
  name: string;
}

export interface WelcomeMessage {
  message: string;
  roomId: string;
  roomName: string;
  playerCount: number;
  timestamp: number;
}

export interface PlayerInfo {
  sessionId: string;
  name: string;
  isOnline: boolean;
  joinedAt: number;
}

export interface PlayerListMessage {
  players: PlayerInfo[];
}

// Các message types mà server gửi về client
export type ServerMessageType = 'welcome' | 'playerList' | 'stateUpdate';

// Các message types mà client gửi lên server
export type ClientMessageType = 'message' | 'changeName';
