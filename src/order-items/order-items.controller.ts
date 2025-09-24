import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('order-items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  create(@Body() dto: CreateOrderItemDto, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.orderItemsService.create(dto, userId, userRole);
  }

  @Get('order/:orderId')
  findAll(
    @Param('orderId', new UUIDValidationPipe()) orderId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    return this.orderItemsService.findAll(orderId, limitNumber, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id', new UUIDValidationPipe()) id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  update(
    @Param('id', new UUIDValidationPipe()) id: string,
    @Body() dto: UpdateOrderItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.orderItemsService.update(id, dto, userId, userRole);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  remove(@Param('id', new UUIDValidationPipe()) id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.orderItemsService.remove(id, userId, userRole);
  }
}
