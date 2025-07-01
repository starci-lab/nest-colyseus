import { Room, Client } from 'colyseus';
import { ChatRoomState, Player } from './schemas/chat-room.schema';

export class ChatRoom extends Room<ChatRoomState> {
  maxClients = 50;

  onCreate(options: any) {
    // Sử dụng setState thay vì class-level initialization
    // this.setState(new ChatRoomState());

    console.log('Create room here');

    console.log(`[Room Created] ${this.roomId} `);
  }

  onJoin(client: Client, options: any) {
    console.log(`✅ Client joined: ${client.sessionId}`);

    // Tạo player mới
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options?.name || `Player_${client.sessionId.substring(0, 6)}`;
    player.joinedAt = Date.now();
    player.isOnline = true;
    // console.log(`👤 Player created: ${player.name} (${client.sessionId})`);
    // Thêm player vào state
    // this.state.players.set(client.sessionId, player);

    // Gửi welcome message cơ bản
    // client.send('welcome', {
    //   message: `Chào mừng ${player.name}!`,
    //   roomId: this.roomId,
    //   roomName: this.state.roomName,
    //   timestamp: Date.now(),
    // });
  }

  onLeave(client: Client, consented?: boolean) {
    console.log(`👋 Client left: ${client.sessionId}`);
    // this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log(`🗑️ Room disposed: ${this.roomId}`);
    this.state.isActive = false;
  }
}
