import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';

@Module({
  imports: [
    ClientsModule.register([{
      name: MICROSERVICES_CLIENTS.ORDERS_SERVICE,
      transport: Transport.TCP,
      options: {
        port: 4001
      }
    },

    {
      name: MICROSERVICES_CLIENTS.USERS_SERVICE,
      transport: Transport.TCP,
      options: {
        port: 4003
      }
    }
    ])
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService],
})
export class AppModule { }
