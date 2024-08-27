import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send(
      { cmd: 'create_product' },
      createProductDto
    );
  }

  @Get()
  findProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send(
      { cmd: 'find_all_products' },
      paginationDto
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    // return this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   .pipe(
    //     catchError(err => { throw new RpcException(err); })
    //   ) 


    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'find_one_product' }, { id })
      );

      return product;

    } catch (error) {
      throw new RpcException(error);
    }


  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {

    try {
      const product = await firstValueFrom(
        this.client.send(
          { cmd: 'update_product' },
          { id, ...updateProductDto }
        )
      );

      return product;

    } catch (error) {
      throw new RpcException(error);
    }

  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.client.send(
          { cmd: 'delete_product' },
          { id }
        )
      );

      return product;

    } catch (error) {
      throw new RpcException(error);
    }
  }

}
