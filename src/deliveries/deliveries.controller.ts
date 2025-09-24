import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/roles.enum';

@Controller('deliveries')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RESTAURANT)
  create(@Body() dto: CreateDeliveryDto, @Req() req: any) {
    const userRole = req.user.role;
    return this.deliveriesService.create(dto, userRole);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  findAll(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Req() req: any,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.deliveriesService.findAll(
      limitNumber,
      pageNumber,
      userId,
      userRole,
    );
  }

  @Get(':id')
  findOne(@Param('id', new UUIDValidationPipe()) id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DRIVER)
  update(
    @Param('id', new UUIDValidationPipe()) id: string,
    @Body() dto: UpdateDeliveryDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.deliveriesService.update(id, dto, userId, userRole);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', new UUIDValidationPipe()) id: string) {
    return this.deliveriesService.remove(id);
  }
}
