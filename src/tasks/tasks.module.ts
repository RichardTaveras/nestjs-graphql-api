// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ItemModule } from '../item/item.module'; // Importa ItemModule

@Module({
  imports: [ItemModule], // <-- Importa ItemModule aquí
  providers: [TasksService],
})
export class TasksModule {}
