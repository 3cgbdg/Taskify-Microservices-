import { Body, Controller, Delete, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(@Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE) private readonly authClient: ClientProxy, private readonly http: HttpService) { }
    @Post("signup")
    async signUp(@Res() res: Response, @Body() dto: CreateAuthDto) {
        const response = await firstValueFrom(
            this.http.post('http://auth-service:3001/auth/signup', dto, {
                withCredentials: true,
            }),
        );

        res.setHeader('set-cookie', response.headers['set-cookie']!);
        return res.json(response.data);
    }

    @Post("login")
    async logIn(@Res() res: Response, @Body() dto: LoginAuthDto) {
        const response = await firstValueFrom(
            this.http.post('http://auth-service:3001/auth/login', dto, {
                withCredentials: true,
            }),
        );

        res.setHeader('set-cookie', response.headers['set-cookie']!);
        return res.json(response.data);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("profile")
    async getOwnProfile(@Req() req: Request) {
        const id = (req as any).user.id;
        return this.authClient.send("auth.profile", id);
    }

    @Delete("logout")
    async logOut(@Res() res: Response) {
        const response = await firstValueFrom(
            this.http.delete('http://auth-service:3001/auth/logout', {
                withCredentials: true,
            }),
        );
        res.setHeader('set-cookie', response.headers['set-cookie']!);
        return res.json(response.data);
    }
    @UseGuards(AuthGuard("jwt"))
    @Post("refresh")
    async refresh(@Res() res: Response) {
        const response = await firstValueFrom(
            this.http.post('http://auth-service:3001/auth/refresh', {
                withCredentials: true,
            }),
        );
        res.setHeader('set-cookie', response.headers['set-cookie']!);
        return res.json(response.data);

    }



}
