import { Room, Client } from 'colyseus';
import { ChatRoomState, Player } from './schemas/chat-room.schema';

export class ChatRoom extends Room<ChatRoomState> {
  maxClients = 50;
  // state = new ChatRoomState();

  onCreate(options: any) {
    // Sử dụng setState thay vì class-level initialization
    // this.setState(new ChatRoomState());

    console.log('Create room here');

    console.log(`[Room Created] ${this.roomId} `);

    this.onMessage(
      'food-purchase',
      (client, data: { foodId: string; price: number; timestamp: number }) => {
        console.log(`🍔 Food purchase from ${client.sessionId}:`, data);

        const { foodId, price, timestamp } = data;

        client.send('food-purchase-response', {
          success: true,
          foodId,
          price,
          message: `Đã mua thành công ${foodId} với giá ${price}`,
          timestamp: Date.now(),
        });

        this.broadcast(
          'player-purchased-food',
          {
            playerId: client.sessionId,
            foodId,
            price,
            timestamp,
          },
          { except: client },
        );
      },
    );
    console.log(`[Sent message] ${this.roomId}`);
  }

  onJoin(client: Client, options: any) {
    console.log(`✅ Client joined: ${client.sessionId}`);

    // Tạo player mới
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options?.name || `Player_${client.sessionId.substring(0, 6)}`;
    player.joinedAt = Date.now();
    player.isOnline = true;
    // this.onMessage('food-puschase', d)

    // Gửi welcome message cơ bản
    // client.send('welcome', {
    //   message: `Chào mừng ${player.name}!`,
    //   roomId: this.roomId,
    //   roomName: this.state.roomName,
    //   timestamp: Date.now(),
    // });

    // this.allowReconnection(client, 60); // Cho phép reconnect trong 60 giây
  }

  onLeave(client: Client, consented?: boolean) {
    console.log(`👋 Client left: ${client.sessionId}`);
    // Allow reconnection for 60 seconds
    this.allowReconnection(client, 60);
    // this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log(`🗑️ Room disposed: ${this.roomId}`);
    // this.state.isActive = false;
  }
}
