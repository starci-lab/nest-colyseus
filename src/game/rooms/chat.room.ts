import { ExtractAuthData, ExtractUserData } from '@colyseus/core/build/Room';
import { Client, Room } from 'colyseus';

interface ChatState {
  messages: string[];
}

// Định nghĩa room + các action trong đây
export class ChatRoom extends Room<ChatState> {
  onCreate(): void | Promise<any> {
    // in-memory state
    this.setState({ messages: [] });

    // Nếu có userService ở đây để tìm kiếm tin nhắn của người nào
    // this.onMessage('message', async (client: Client, message: string) => {
    //   const userServie = Globals.nestApp.get(UserService);
    //   const user = await userServie.findOne(client.sessionId);
    //   const msg = user ? `${user.name}: ${message}` : message;
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
  ): void | Promise<any> {
    console.log(`Client ${client.sessionId} leaved chat`);
  }
}
