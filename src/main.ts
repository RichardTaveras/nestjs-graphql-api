// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isCronJob = process.argv.includes('--cron');

  if (isCronJob) {
    // Ejecutar la tarea y salir
    const tasksService = app.get(TasksService);
    await tasksService.handleCron();
    await app.close();
    process.exit(0);
  } else {
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
}
bootstrap();
