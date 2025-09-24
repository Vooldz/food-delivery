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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CUSTOMER, Role.ADMIN)
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  findAll(
    @Req() req: any,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    return this.ordersService.findAll(
      req.user.id,
      req.user.role,
      limitNumber,
      pageNumber,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  findOne(@Param('id', new UUIDValidationPipe()) id: string, @Req() req: any) {
    return this.ordersService.findOne(id, req.user.role, req.user.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  update(
    @Param('id', new UUIDValidationPipe()) id: string,
    @Body() dto: UpdateOrderDto,
    @Req() req: any,
  ) {
    return this.ordersService.update(id, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  remove(@Param('id', new UUIDValidationPipe()) id: string, @Req() req: any) {
    return this.ordersService.remove(id, req.user.id, req.user.role);
  }
}
