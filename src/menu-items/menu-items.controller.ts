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
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('menu-items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RESTAURANT)
  create(@Body() dto: CreateMenuItemDto, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.menuItemsService.create(dto, userId, userRole);
  }

  @Get('restaurant/:restaurantId')
  findAll(
    @Param('restaurantId', new UUIDValidationPipe()) restaurantId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    const pageNumber = page ? parseInt(page, 10) : 1;
    return this.menuItemsService.findAll(restaurantId, limitNumber, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id', new UUIDValidationPipe()) id: string) {
    return this.menuItemsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  update(
    @Param('id', new UUIDValidationPipe()) id: string,
    @Body() dto: UpdateMenuItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.menuItemsService.update(id, dto, userId, userRole);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  remove(@Param('id', new UUIDValidationPipe()) id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.menuItemsService.remove(id, userId, userRole);
  }
}
