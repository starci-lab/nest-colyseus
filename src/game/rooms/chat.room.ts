import { Room, Client } from 'colyseus';
import { ChatRoomState, Player, Message } from './schemas/chat-room.schema';

export class ChatRoom extends Room<ChatRoomState> {
  maxClients = 50;
  state = new ChatRoomState();
  onCreate(options: any) {
    // Thiết lập tên room nếu có
    if (options?.roomName) {
      this.state.roomName = options.roomName;
    }

    console.log(`[Room Created] ${this.roomId} - ${this.state.roomName}`);

    // Giao tiếp client → server
    this.onMessage('message', (client, data: { message: string }) => {
      console.log(`📩 Message from ${client.sessionId}: ${data.message}`);

      // Tạo message mới
      const newMessage = new Message();
      newMessage.id = `${Date.now()}_${client.sessionId}`;
      newMessage.sender = client.sessionId;
      newMessage.senderName =
        this.state.players.get(client.sessionId)?.name || 'Anonymous';
      newMessage.content = data.message;
      newMessage.timestamp = Date.now();

      // Thêm message vào state
      this.state.messages.push(newMessage);

      // Giới hạn số lượng message (giữ 100 message gần nhất)
      if (this.state.messages.length > 100) {
        this.state.messages.shift();
      }
    });

    // Xử lý khi client đổi tên
    this.onMessage('changeName', (client, data: { name: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (player && data.name && data.name.trim()) {
        const oldName = player.name;
        player.name = data.name.trim();

        // Gửi thông báo hệ thống
        const systemMessage = new Message();
        systemMessage.id = `${Date.now()}_system`;
        systemMessage.sender = 'system';
        systemMessage.senderName = 'System';
        systemMessage.content = `${oldName} đã đổi tên thành ${player.name}`;
        systemMessage.timestamp = Date.now();
        systemMessage.type = 'system';

        this.state.messages.push(systemMessage);
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(`✅ Client joined: ${client.sessionId}`);

    // Tạo player mới
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options?.name || `Player_${client.sessionId.substring(0, 6)}`;
    player.joinedAt = Date.now();
    player.isOnline = true;

    // Thêm player vào state
    this.state.players.set(client.sessionId, player);

    // Gửi welcome message
    client.send('welcome', {
      message: `Chào mừng ${player.name} đến với phòng chat!`,
      roomId: this.roomId,
      roomName: this.state.roomName,
      playerCount: this.state.players.size,
      timestamp: Date.now(),
    });

    // Gửi thông báo hệ thống cho tất cả người chơi
    const joinMessage = new Message();
    joinMessage.id = `${Date.now()}_system`;
    joinMessage.sender = 'system';
    joinMessage.senderName = 'System';
    joinMessage.content = `${player.name} đã tham gia phòng chat`;
    joinMessage.timestamp = Date.now();
    joinMessage.type = 'system';

    this.state.messages.push(joinMessage);

    // Gửi danh sách players hiện tại cho client mới
    client.send('playerList', {
      players: Array.from(this.state.players.values()).map((p) => ({
        sessionId: p.sessionId,
        name: p.name,
        isOnline: p.isOnline,
        joinedAt: p.joinedAt,
      })),
    });
  }

  onLeave(client: Client, consented?: boolean) {
    console.log(
      `👋 Client left: ${client.sessionId} (consented: ${consented})`,
    );

    const player = this.state.players.get(client.sessionId);
    if (player) {
      // Đánh dấu player offline
      player.isOnline = false;

      // Gửi thông báo hệ thống
      const leaveMessage = new Message();
      leaveMessage.id = `${Date.now()}_system`;
      leaveMessage.sender = 'system';
      leaveMessage.senderName = 'System';
      leaveMessage.content = `${player.name} đã rời phòng chat`;
      leaveMessage.timestamp = Date.now();
      leaveMessage.type = 'system';

      this.state.messages.push(leaveMessage);

      // Xóa player khỏi state sau 30 giây (trong trường hợp reconnect)
      setTimeout(() => {
        this.state.players.delete(client.sessionId);
      }, 30000);
    }
  }

  onError(client: Client, err: Error) {
    console.error(`❌ Error from ${client.sessionId}:`, err);
  }

  onDispose() {
    console.log(`🗑️ Room disposed: ${this.roomId} - ${this.state.roomName}`);

    // Cleanup logic nếu cần
    this.state.isActive = false;
  }
}
