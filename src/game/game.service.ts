import { WebSocketTransport } from '@colyseus/ws-transport';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { RedisPresence, Room, Server } from 'colyseus';
import * as http from 'http';

type Type<T> = new (...args: any[]) => T;

// Config cho Colyseus
@Injectable()
export class GameService implements OnApplicationShutdown {
  server: Server = null;

  // Khởi tạo server -> Chia sẻ cùng cổng và server giữa NestJS
  createServer(httpServer: http.Server) {
    if (this.server) return;
    this.server = new Server({
      transport: new WebSocketTransport({
        server: httpServer,
      }),
      presence: new RedisPresence({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      }),
    });
  }

  // Định nghĩa room + type
  defineRoom(name: string, room: Type<Room<any>>) {
    this.server.define(name, room);
  }

  // Lắng nghe port của server
  listen(port: number): Promise<void> {
    if (!this.server) return;
    return this.server.listen(port);
  }

  onApplicationShutdown(signal: string) {
    if (!this.server) return;
    console.log(`Shutdown GameService on signal: ${signal}`);
    this.server.gracefullyShutdown();
  }
}
