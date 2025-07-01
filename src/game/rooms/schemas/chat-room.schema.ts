import { Schema, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') sessionId: string;
  @type('string') name: string;
  @type('number') joinedAt: number;
  @type('boolean') isOnline: boolean;

  constructor() {
    super();
  }
}

export class ChatRoomState extends Schema {
  // @type({ map: Player }) players: MapSchema<Player>;
  @type('number') maxPlayers: number;
  @type('number') createdAt: number;
  // @type('string') roomName: string;
  @type('boolean') isActive: boolean;

  constructor() {
    super();
    // this.players = new MapSchema<Player>();
    this.maxPlayers = 50;
    // this.roomName = 'Chat Room';
    this.isActive = true;
  }
}
