import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Role } from 'src/auth/roles.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateDriverDto, userId: string, userRole: Role) {
    if (userRole !== Role.DRIVER) {
      throw new ForbiddenException('Access Denied');
    }

    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (driver) {
      throw new ConflictException('Driver profile already exists');
    }

    return this.prisma.driver.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(limit: number, page: number) {
    const drivers = await this.prisma.driver.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
    });

    const totalDrivers = await this.prisma.driver.count();

    const totalPages = Math.ceil(totalDrivers / limit);

    if (page > totalPages && totalDrivers > 0) {
      throw new NotFoundException('Page not found');
    }

    if (drivers.length === 0) {
      return {
        data: 'No Drivers To Show',
        totalDrivers,
        page,
        totalPages,
      };
    }

    return { data: drivers, totalDrivers, page, totalPages };
  }

  async findOne(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async update(
    driverId: string,
    dto: UpdateDriverDto,
    userId: string,
    userRole: Role,
  ) {
    if (userRole !== Role.ADMIN && userRole !== Role.DRIVER) {
      throw new ForbiddenException('Access Denied');
    }

    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (driver.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access Denied');
    }

    return this.prisma.driver.update({
      where: { id: driverId },
      data: {
        ...dto,
      },
    });
  }

  async remove(driverId: string, userId: string, userRole: Role) {
    if (userRole !== Role.ADMIN && userRole !== Role.DRIVER) {
      throw new ForbiddenException('Access Denied');
    }
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (driver.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access Denied');
    }

    return this.prisma.driver.delete({ where: { id: driverId } });
  }
}
