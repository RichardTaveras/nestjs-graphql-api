// src/tasks/tasks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ItemService } from '../item/item.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly itemService: ItemService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Ejecutando tarea programada para limpiar items antiguos');

    const deletedItems = await this.itemService.removeOldItems();

    this.logger.debug(`Se han eliminado ${deletedItems} items antiguos`);
  }
}

