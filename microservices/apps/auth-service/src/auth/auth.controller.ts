  import { Body, Controller, Delete, HttpException, HttpStatus, NotFoundException, Post, Req, Res } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import type { Request, Response } from 'express';
  import { ConfigService } from '@nestjs/config';
  import { PrismaService } from 'prisma/prisma.service';
  import { LoginAuthDto } from './dto/login-auth.dto';
  import { CreateAuthDto } from './dto/create-auth.dto';
  import { JwtService } from '@nestjs/jwt';
  import { MessagePattern } from '@nestjs/microservices';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService, private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }


    @Post("signup")
    async signup(createAuthDto: CreateAuthDto, @Res() res: Response): Promise<Response<any, Record<string, any>>> {
      const response = await this.authService.signup(createAuthDto);
      res.cookie('access_token', response.access_token, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',

        maxAge: 1000 * 60 * 15,
      })
      res.cookie('refresh_token', response.refresh_token, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',

        maxAge: 1000 * 3600 * 24 * 7,
      })
      return res.json({ message: "Successfully signed up!" });
    }

    @Post("login")
    async login(LoginAuthDto: LoginAuthDto, @Res() res: Response): Promise<Response<any, Record<string, any>>> {
      const response = await this.authService.login(LoginAuthDto);
      res.cookie('access_token', response.access_token, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',

        maxAge: 1000 * 60 * 15,
      })
      res.cookie('refresh_token', response.refresh_token, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',

        maxAge: 1000 * 3600 * 24 * 7,
      })
      return res.json({ message: "Successfully logged in!" });
    }


    @MessagePattern("auth.profile")
    async profile(id: string): Promise<any | null> {
      const user = await this.prisma.user.findUnique({ where: { id } })
      if (user) {
        const { hashedPassword, ...returnData } = user;
        return returnData;
      }
      return null;
    }

    @Post("refresh")
    async refreshToken(@Req() req: Request, @Res() res: Response): Promise<Response<any, Record<string, any>>> {
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        throw new HttpException("No refresh token", HttpStatus.UNAUTHORIZED);
      }
      let payload: any;
      try {
        payload = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_SECRET')! });
      } catch (err) {
        throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw new NotFoundException();
      }
      const newAccessToken = await this.authService.createTokenForRefresh(user)
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 15,
      });



      return res.json({ message: 'Access token refreshed' });

    }


    @Delete("logout")
    async logout(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {


      res.clearCookie('access_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      });
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      });

      return { message: 'Successfully logged out!' };

    }

  }

