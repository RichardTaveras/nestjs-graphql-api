import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessThan } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @Inject('RABBITMQ_SERVICE')
    private client: ClientProxy,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemRepository.create(createItemInput);
    const item = await this.itemRepository.save(newItem);

    // Enviar mensaje a RabbitMQ
    this.client.emit('item_created', item);

    return item;
  }

  findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  findOne(id: number): Promise<Item> {
    return this.itemRepository.findOneBy({ id });
  }

  async update(id: number, updateItemInput: UpdateItemInput): Promise<Item> {
    await this.itemRepository.update(id, updateItemInput);
    const item = await this.itemRepository.findOneBy({ id });

    // Enviar mensaje a RabbitMQ
    this.client.emit('item_updated', item);

    return item;
  }


  async remove(id: number): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    await this.itemRepository.delete(id);
    return item;
  }

  async removeOldItems(): Promise<number> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);

    const oldItems = await this.itemRepository.find({
      where: {
        fechaCreacion: LessThan(dateLimit),
      },
    });

    const deletedItems = await this.itemRepository.remove(oldItems);

    return deletedItems.length;
  }

}
