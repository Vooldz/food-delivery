import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Role } from 'src/auth/roles.enum';

@Injectable()
export class OrderItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderItemDto, userId: string, userRole: Role) {
    // Customers create items only for their own orders
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You cannot add items to this order');
    }

    return this.prisma.orderItem.create({
      data: {
        quantity: dto.quantity,
        price: dto.price,
        order: { connect: { id: dto.orderId } },
        menuItem: { connect: { id: dto.menuItemId } },
      },
    });
  }

  async findAll(orderId: string, limit: number, page: number) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { menuItem: true },
    });

    const totalItems = await this.prisma.orderItem.count({
      where: { orderId },
    });
    const totalPages = Math.ceil(totalItems / limit);

    return { data: items, totalItems, page, totalPages };
  }

  async findOne(id: string) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id },
      include: { menuItem: true, order: true },
    });
    if (!item) throw new NotFoundException('Order Item not found');
    return item;
  }

  async update(
    id: string,
    dto: UpdateOrderItemDto,
    userId: string,
    userRole: Role,
  ) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!item) throw new NotFoundException('Order Item not found');

    if (userRole !== Role.ADMIN && item.order.userId !== userId) {
      throw new ForbiddenException('You cannot update this item');
    }

    return this.prisma.orderItem.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!item) throw new NotFoundException('Order Item not found');

    if (userRole !== Role.ADMIN && item.order.userId !== userId) {
      throw new ForbiddenException('You cannot delete this item');
    }

    return this.prisma.orderItem.delete({ where: { id } });
  }
}
