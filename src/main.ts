import { NestFactory } from '@nestjs/core';
import { createServer } from 'http';
import { AppModule } from './app.module';
import { GameService } from './game/game.service';
import { ROOMS } from './game/rooms';
import { Globals } from './libs/utils/global';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.init();

  Globals.nestApp = app;

  const expressApp = app.getHttpAdapter().getInstance();
  const httpServer = createServer(expressApp);

  const gameService = app.get(GameService);
  gameService.createServer(httpServer);

  for (const { name, type } of ROOMS) {
    gameService.defineRoom(name, type);
    console.log(`[Colyseus] Registered room: ${name}`);
  }

  const PORT = parseInt(process.env.PORT || '3001');
  await gameService.listen(PORT);
  console.log(`✅ Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`Colyseus is running on http://localhost:${PORT}`);
}
bootstrap();
