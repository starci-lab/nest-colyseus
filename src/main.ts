import { NestFactory } from '@nestjs/core';
import { createServer } from 'http';
import { AppModule } from './app.module';
import { GameService } from './game/game.service';
import { ROOMS } from './game/rooms';
import { Globals } from './libs/utils/global';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Nest Colyseus API')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth();
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      displayOperationId: true,
      displayRequestDuration: true,
      filter: true,
    },
  });

  const NEST_PORT = parseInt(process.env.NEST_PORT || '3001');
  await app.listen(NEST_PORT);
  console.log(`Swagger UI: http://localhost:${NEST_PORT}/docs`);

  const httpServer = createServer();
  const gameService = app.get(GameService);
  gameService.createServer(httpServer);

  for (const { name, type } of ROOMS) {
    gameService.defineRoom(name, type);
  }

  const COLYSEUS_PORT = parseInt(process.env.COLYSEUS_PORT || '3002');
  httpServer.listen(COLYSEUS_PORT, () => {
    console.log(`Colyseus is running on ws://localhost:${COLYSEUS_PORT}`);
  });
}
bootstrap();
