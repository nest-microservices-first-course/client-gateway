import { Controller, Get, Post, Body, Patch, Param, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
    // return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {

    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto)
      );

      return orders;
    } catch (error) {
      throw new RpcException(error);

    }

  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {

    try {
      const orderFound = await firstValueFrom(
        this.client.send('findOneOrder', id)
      );

      return orderFound;

    } catch (error) {
      throw new RpcException(error);
    }

  }


  @Get(':status')
  async findAllByStatus(@Param('status') status: StatusDto, @Query() paginationDto: PaginationDto) {
    try {
      const ordersFound = await firstValueFrom(
        this.client.send('findAllOrders', {
          ...paginationDto,
          status
        })
      );
      return ordersFound;
    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Patch(':id')
  async changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      const updatedOrder = await firstValueFrom(
        this.client.send('changeOrderStatus', { id, status: statusDto.status })
      );
      return updatedOrder;
    } catch (error) {
      throw new RpcException(error);
    }
  }

}
