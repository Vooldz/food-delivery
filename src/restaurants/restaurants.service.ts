import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../auth/roles.enum';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    userRole: Role,
    createRestaurantDto: CreateRestaurantDto,
  ) {
    if (userRole !== Role.RESTAURANT && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access Denied');
    }
    return this.prisma.restaurant.create({
      data: {
        ...createRestaurantDto,
        userId,
      },
    });
  }

  async findAll(limit: number, page: number) {
    const restaurants = await this.prisma.restaurant.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { isActive: 'desc' }],
    });

    const totalRestaurants = await this.prisma.restaurant.count();

    const totalPages = Math.ceil(totalRestaurants / limit);

    if (page > totalPages && totalRestaurants > 0) {
      throw new NotFoundException('Page not found');
    }

    if (restaurants.length === 0) {
      return {
        data: 'No Restaurants To Show',
        totalRestaurants,
        page,
        totalPages,
      };
    }

    return { data: restaurants, totalRestaurants, page, totalPages };
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async update(
    restaurantId: string,
    userId: string,
    userRole: Role,
    dto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (userRole !== Role.ADMIN && restaurant.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this restaurant',
      );
    }

    return this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (userRole !== Role.ADMIN && restaurant.userId !== userId) {
      throw new ForbiddenException('Access Denied');
    }

    return this.prisma.restaurant.delete({
      where: { id },
    });
  }
}
