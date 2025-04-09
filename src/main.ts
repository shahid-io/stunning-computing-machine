import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { INestApplication } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAMES } from '@utils/queue.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  AppModule.setupSwagger(app);

  setupBullBoard(app);
  await app.listen(process.env.PORT || 3000);
  console.log(`Dashboard => http://localhost:3000/admin/queues`);
}

function setupBullBoard(app: INestApplication) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const { addQueue } = createBullBoard({
    queues: [],
    serverAdapter,
  });
  const queues = app.get<'BullQueue_tasks', Queue>(`BullQueue_${QUEUE_NAMES.TASKS}`);
  addQueue(new BullAdapter(queues));
  app.use('/admin/queues', serverAdapter.getRouter());
}
bootstrap();