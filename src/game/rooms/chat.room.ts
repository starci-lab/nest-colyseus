import { ExtractAuthData, ExtractUserData } from '@colyseus/core/build/Room';
import { Client, Room } from 'colyseus';
import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema';

export class Message extends Schema {
  @type('string') content: string;
  @type('string') sender: string;
  @type('number') timestamp: number;
}

export class ChatState extends Schema {
  @type([Message]) messages = new ArraySchema<Message>();
}

// Định nghĩa room + các action trong đây
export class ChatRoom extends Room<ChatState> {
  onCreate(): void | Promise<any> {
    // Iniitialize the chat state
    this.setState(new ChatState());

    // Config room
    this.maxClients = 50;
    this.autoDispose = false;

    this.onMessage('message', (client: Client, data: { message: string }) => {
      try {
        const newMessage = new Message();
        newMessage.content = data.message;
        newMessage.sender = client.sessionId;
        newMessage.timestamp = Date.now();

        this.state.messages.push(newMessage);
        console.log(`Message from ${client.sessionId}: ${data.message}`);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Nếu có userService ở đây để tìm kiếm tin nhắn của người nào
    // this.onMessage('message', async (client: Client, message: string) => {
    //   const userServie = Globals.nestApp.get(UserService);
    //   const user = await userServie.findOne(client.sessionId);
    //   const msg = user ? `${user.wallet_address}: ${message}` : message;
    //   this.state.messages.push(msg);
    //   this.broadcast('message', msg);
    // });
  }

  onJoin(client: Client) {
    console.log(`Client ${client.sessionId} joined chat`);
  }

  onLeave(
    client: Client<
      ExtractUserData<this['clients']>,
      ExtractAuthData<this['clients']>
    >,
    consented?: boolean,
  ): void | Promise<any> {
    console.log(
      `Client ${client.sessionId} left chat (consented: ${consented})`,
    );

    if (!consented) {
      console.log(`Client ${client.sessionId} disconnected unexpectedly`);
    }
  }

  onError(client: Client, error: Error) {
    console.error(`Error from client ${client.sessionId}:`, error);
  }

  onDispose() {
    console.log('ChatRoom disposed');
  }
}
