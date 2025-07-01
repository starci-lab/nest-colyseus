import { Schema, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') sessionId: string;
  @type('string') name: string;
  @type('number') joinedAt: number;
  @type('boolean') isOnline: boolean = true;
}

export class Message extends Schema {
  @type('string') id: string;
  @type('string') sender: string;
  @type('string') senderName: string;
  @type('string') content: string;
  @type('number') timestamp: number;
  @type('string') type: string = 'text'; // 'text', 'system', 'emoji', etc.
}

export class ChatRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Message]) messages: Message[] = [];
  @type('number') maxPlayers: number = 50;
  @type('number') createdAt: number = Date.now();
  @type('string') roomName: string = 'Chat Room';
  @type('boolean') isActive: boolean = true;
}
