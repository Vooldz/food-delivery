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
  Query,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('drivers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(Role.DRIVER)
  create(@Body() createDriverDto: CreateDriverDto, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.driversService.create(createDriverDto, userId, userRole);
  }

  @Get()
  findAll(@Query('limit') limit: string, @Query('page') page: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    return this.driversService.findAll(limitNumber, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id', new UUIDValidationPipe()) id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DRIVER)
  update(
    @Param('id', new UUIDValidationPipe()) id: string,
    @Body() updateDriverDto: UpdateDriverDto,
    @Req() req: any,
  ) {
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.driversService.update(id, updateDriverDto, userId, userRole);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DRIVER)
  remove(@Param('id', new UUIDValidationPipe()) id: string, @Req() req: any) {
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.driversService.remove(id, userId, userRole);
  }
}
