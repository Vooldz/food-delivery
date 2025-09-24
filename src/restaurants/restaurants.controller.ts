import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(Role.RESTAURANT, Role.ADMIN)
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;

    return this.restaurantsService.create(
      userId,
      userRole,
      createRestaurantDto,
    );
  }

  @Get()
  async findAll(@Query('limit') limit: string, @Query('page') page: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 20;
    return await this.restaurantsService.findAll(limitNumber, pageNumber);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.RESTAURANT, Role.ADMIN)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return await this.restaurantsService.update(
      id,
      userId,
      userRole,
      updateRestaurantDto,
    );
  }

  @Delete(':id')
  @Roles(Role.RESTAURANT, Role.ADMIN)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userRole = req.user.role;
    const userId = req.user.id;
    return await this.restaurantsService.remove(id, userId, userRole);
  }
}
