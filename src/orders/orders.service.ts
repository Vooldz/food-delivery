import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Role } from 'src/auth/roles.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.order.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string, userRole: Role, limit = 20, page = 1) {
    const skip = (page - 1) * limit;

    const orders = await this.prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: { restaurant: true },
    });

    const total = await this.prisma.order.count({ where: { userId } });

    return { data: orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(orderId: string, userRole: Role, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Access Denied');
    }

    return order;
  }

  async update(
    orderId: string,
    dto: UpdateOrderDto,
    userId: string,
    userRole: Role,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Access Denied');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { ...dto, statusUpdatedAt: dto.status ? new Date() : undefined },
    });
  }

  async remove(orderId: string, userRole: Role, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (userRole === Role.CUSTOMER && order.userId !== userId) {
      throw new ForbiddenException('Access Denied');
    }

    return this.prisma.order.delete({ where: { id: orderId } });
  }
}
