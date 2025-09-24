import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Role } from 'src/auth/roles.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMenuItemDto, userId: string, userRole: Role) {
    if (userRole !== Role.RESTAURANT && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access Denied');
    }
    const { restaurantId, ...restDto } = dto;

    if (!restaurantId) {
      throw new BadRequestException('Restaurant Id Is Required');
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (userRole !== Role.ADMIN && restaurant.userId !== userId) {
      throw new ForbiddenException('You cannot add items to this restaurant');
    }

    return this.prisma.menuItem.create({
      data: {
        ...restDto,
        restaurant: {
          connect: { id: restaurantId },
        },
      },
    });
  }

  async findAll(restaurantId: string, limit: number, page: number) {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be greater than 0');
    }

    const menuItems = await this.prisma.menuItem.findMany({
      where: { restaurantId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isAvailable: 'desc' }, { createdAt: 'desc' }],
    });

    const totalMenuItems = await this.prisma.menuItem.count({
      where: { restaurantId },
    });

    const totalPages = Math.ceil(totalMenuItems / limit);

    if (page > totalPages && totalMenuItems > 0) {
      throw new NotFoundException('Page not found');
    }

    return { data: menuItems, totalMenuItems, page, totalPages };
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) throw new NotFoundException('Menu Item Not Found');

    return menuItem;
  }

  async update(
    menuItemId: string,
    dto: UpdateMenuItemDto,
    userId: string,
    userRole: Role,
  ) {
    if (userRole !== Role.ADMIN && userRole !== Role.RESTAURANT) {
      throw new ForbiddenException('Access Denied');
    }

    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu Item Not Found');
    }

    if (userRole !== Role.ADMIN && menuItem.restaurant.userId !== userId) {
      throw new ForbiddenException('You cannot update this menu item');
    }

    let rest: Partial<UpdateMenuItemDto>;
    if (dto.restaurantId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { restaurantId, ...restDto } = dto;
      rest = restDto;
    } else {
      rest = dto;
    }

    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        ...rest,
      },
    });
  }

  async remove(menuItemId: string, userId, userRole) {
    if (userRole !== Role.ADMIN && userRole !== Role.RESTAURANT) {
      throw new ForbiddenException('Access Denied');
    }

    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu Item Not Found');
    }

    if (userRole !== Role.ADMIN && menuItem.restaurant.userId !== userId) {
      throw new ForbiddenException('You cannot delete this menu item');
    }

    return this.prisma.menuItem.delete({
      where: { id: menuItemId },
    });
  }
}
