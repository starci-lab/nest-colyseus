// import { ExtractAuthData, ExtractUserData } from '@colyseus/core/build/Room';
// import { Client, Room } from 'colyseus';
// import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema';

// export class Message extends Schema {
//   @type('string') content: string;
//   @type('string') sender: string;
//   @type('number') timestamp: number;
// }

// export class ChatState extends Schema {
//   @type([Message]) messages = new ArraySchema<Message>();
// }

// // Định nghĩa room + các action trong đây
// export class ChatRoom extends Room<ChatState> {
//   onCreate(): void | Promise<any> {
//     // Iniitialize the chat state
//     this.setState(new ChatState());

//     // Config room
//     this.maxClients = 50;
//     this.autoDispose = false;

//     this.onMessage('message', (client: Client, data: { message: string }) => {
//       try {
//         const newMessage = new Message();
//         newMessage.content = data.message;
//         newMessage.sender = client.sessionId;
//         newMessage.timestamp = Date.now();

//         // this.state.messages.push(newMessage);
//         console.log(`Message from ${client.sessionId}: ${data.message}`);
//       } catch (error) {
//         console.error('Error handling message:', error);
//       }
//     });

//     // Nếu có userService ở đây để tìm kiếm tin nhắn của người nào
//     // this.onMessage('message', async (client: Client, message: string) => {
//     //   const userServie = Globals.nestApp.get(UserService);
//     //   const user = await userServie.findOne(client.sessionId);
//     //   const msg = user ? `${user.wallet_address}: ${message}` : message;
//     //   this.state.messages.push(msg);
//     //   this.broadcast('message', msg);
//     // });
//   }

//   onJoin(client: Client) {
//     console.log(`Client ${client.sessionId} joined chat`);

//     // Gửi ping message để client biết đã connect thành công
//     client.send('ping', {
//       status: 'connected',
//       message: 'Successfully connected to server',
//       timestamp: Date.now(),
//       sessionId: client.sessionId,
//     });

//     // Gửi welcome message
//     client.send('welcome', {
//       message: 'Welcome to the chat room!',
//       timestamp: Date.now(),
//       roomId: this.roomId,
//     });
//   }

//   onLeave(
//     client: Client<
//       ExtractUserData<this['clients']>,
//       ExtractAuthData<this['clients']>
//     >,
//     consented?: boolean,
//   ): void | Promise<any> {
//     console.log(
//       `Client ${client.sessionId} left chat (consented: ${consented})`,
//     );

//     if (!consented) {
//       console.log(`Client ${client.sessionId} disconnected unexpectedly`);
//     }
//   }

//   onError(client: Client, error: Error) {
//     console.error(`Error from client ${client.sessionId}:`, error);
//   }

//   onDispose() {
//     console.log('ChatRoom disposed');
//   }
// }
import { Room, Client } from 'colyseus';

export class ChatRoom extends Room {
  onCreate() {
    console.log(`[Room Created] ${this.roomId}`);

    // Giao tiếp client → server
    this.onMessage('message', (client, data: { message: string }) => {
      console.log(`📩 Message from ${client.sessionId}: ${data.message}`);

      // Gửi lại message cho tất cả client
      this.broadcast('message', {
        sender: client.sessionId,
        message: data.message,
        timestamp: Date.now(),
      });
    });
  }

  onJoin(client: Client) {
    console.log(`✅ Client joined: ${client.sessionId}`);

    client.send('welcome', {
      message: 'Welcome to the chat room!',
      roomId: this.roomId,
      timestamp: Date.now(),
    });
  }

  onLeave(client: Client, consented?: boolean) {
    console.log(
      `👋 Client left: ${client.sessionId} (consented: ${consented})`,
    );
  }

  onError(client: Client, err: Error) {
    console.error(`❌ Error from ${client.sessionId}:`, err);
  }

  onDispose() {
    console.log(`🗑️ Room disposed: ${this.roomId}`);
  }
}
