import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { DriversModule } from './drivers/drivers.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { DeliveriesModule } from './deliveries/deliveries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RestaurantsModule,
    DriversModule,
    MenuItemsModule,
    OrdersModule,
    OrderItemsModule,
    DeliveriesModule,
  ],
})
export class AppModule {}
