import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { AuthController } from './auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }
      })
    }),
    ClientsModule.register([{
      name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
      transport: Transport.TCP,
      options: {
        port: 4001
      }
    },


    ])
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule { }
