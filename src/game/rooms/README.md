# ChatRoom với Colyseus Schema

## Tổng quan

ChatRoom đã được cập nhật để sử dụng Colyseus Schema, cho phép đồng bộ hóa state realtime giữa server và client.

## Schema Structure

### ChatRoomState

- `players`: Map các Player trong room
- `messages`: Mảng các Message
- `maxPlayers`: Số lượng player tối đa (50)
- `createdAt`: Thời gian tạo room
- `roomName`: Tên của room
- `isActive`: Trạng thái hoạt động của room

### Player

- `sessionId`: ID phiên của client
- `name`: Tên hiển thị của player
- `joinedAt`: Thời gian tham gia
- `isOnline`: Trạng thái online/offline

### Message

- `id`: ID duy nhất của message
- `sender`: SessionId của người gửi
- `senderName`: Tên hiển thị của người gửi
- `content`: Nội dung tin nhắn
- `timestamp`: Thời gian gửi
- `type`: Loại message ('text', 'system', 'emoji')

## Server Events

### Messages từ Client lên Server:

- `message`: Gửi tin nhắn chat

  ```typescript
  room.send('message', { message: 'Hello world!' });
  ```

- `changeName`: Đổi tên hiển thị
  ```typescript
  room.send('changeName', { name: 'New Name' });
  ```

### Messages từ Server xuống Client:

- `welcome`: Tin nhắn chào mừng khi join
- `playerList`: Danh sách players hiện tại

## Tính năng

### Đã có:

1. ✅ Schema-based state management
2. ✅ Realtime message broadcasting
3. ✅ Player management (join/leave)
4. ✅ Change player name
5. ✅ System messages (join/leave/name change)
6. ✅ Message history (giữ 100 message gần nhất)
7. ✅ Player offline handling (xóa sau 30s để cho phép reconnect)

### Có thể mở rộng:

1. Message reactions (emoji)
2. Private messages
3. Room channels/topics
4. Message moderation
5. File/image sharing
6. Voice/video call integration
7. Player roles (admin, moderator)
8. Message encryption

## Cách sử dụng Client

```typescript
import { Client } from 'colyseus.js';

const client = new Client('ws://localhost:2567');

// Join room với tên tùy chọn
const room = await client.joinOrCreate('chat', {
  name: 'MyUsername',
  roomName: 'General Chat'
});

// Lắng nghe state changes
room.onStateChange((state) => {
  console.log('Room state updated:', state);

  // Access players
  state.players.forEach((player, sessionId) => {
    console.log(\`Player \${player.name} (\${sessionId}) is online: \${player.isOnline}\`);
  });

  // Access messages
  state.messages.forEach((message) => {
    console.log(\`[\${message.senderName}]: \${message.content}\`);
  });
});

// Gửi message
room.send('message', { message: 'Hello everyone!' });

// Đổi tên
room.send('changeName', { name: 'NewUsername' });

// Lắng nghe welcome message
room.onMessage('welcome', (data) => {
  console.log('Welcome:', data.message);
  console.log('Room:', data.roomName);
  console.log('Players online:', data.playerCount);
});
```

## Performance Notes

- Messages được giới hạn 100 tin nhắn gần nhất
- Players offline sẽ bị xóa sau 30 giây (cho phép reconnect)
- Schema tự động sync chỉ những thay đổi cần thiết
