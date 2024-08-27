import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, ORDER_SERVICE } from 'src/config';
import { NastModule } from 'src/transports/nast.module';

@Module({
  controllers: [OrdersController],
  imports: [NastModule],
})
export class OrdersModule {
  constructor(

  ) { }
}
