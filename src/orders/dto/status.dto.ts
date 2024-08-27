import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class StatusDto {

    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Valid order status are: ${OrderStatusList}`
    })
    status: OrderStatus;
}