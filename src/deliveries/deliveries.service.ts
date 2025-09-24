import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Role } from 'src/auth/roles.enum';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDeliveryDto, userRole: Role) {
    if (userRole !== Role.ADMIN && userRole !== Role.RESTAURANT) {
      throw new ForbiddenException('Access Denied');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    const existing = await this.prisma.delivery.findUnique({
      where: { orderId: dto.orderId },
    });

    if (existing) {
      throw new BadRequestException('Delivery already exists for this order');
    }

    return this.prisma.delivery.create({
      data: {
        orderId: dto.orderId,
        driverId: dto.driverId,
        assignedAt: dto.assignedAt || undefined,
      },
    });
  }

  private buildWhere(userId: string, userRole: Role) {
    if (userRole === Role.CUSTOMER) {
      return { order: { userId } };
    }
    if (userRole === Role.RESTAURANT) {
      return { order: { restaurant: { userId } } };
    }
    if (userRole === Role.DRIVER) {
      return { driverId: userId };
    }
    if (userRole === Role.ADMIN) {
      return {};
    }
    throw new ForbiddenException('Access Denied');
  }

  async findAll(limit: number, page: number, userId: string, userRole: Role) {
    const deliveries = await this.prisma.delivery.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: this.buildWhere(userId, userRole),
      orderBy: { createdAt: 'desc' },
      include: {
        order: true,
        driver: true,
      },
    });

    const total = await this.prisma.delivery.count({
      where: userRole === Role.ADMIN ? {} : { order: { userId: userId } },
    });
    const totalPages = Math.ceil(total / limit);

    return { data: deliveries, total, page, totalPages };
  }

  async findOne(id: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: { order: true, driver: true },
    });

    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async update(
    id: string,
    dto: UpdateDeliveryDto,
    userId: string,
    userRole: Role,
  ) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) throw new NotFoundException('Delivery not found');

    if (userRole === Role.DRIVER) {
      if (delivery.driverId !== userId) {
        throw new ForbiddenException('You are not assigned to this delivery');
      }
    }

    return this.prisma.delivery.update({
      where: { id },
      data: { ...dto },
      include: { order: true, driver: true },
    });
  }

  async remove(id: string) {
    const delivery = await this.prisma.delivery.findUnique({ where: { id } });

    if (!delivery) throw new NotFoundException('Delivery not found');

    return this.prisma.delivery.delete({ where: { id } });
  }
}
