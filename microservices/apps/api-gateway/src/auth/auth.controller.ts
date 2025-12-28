import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE) private readonly authClient: ClientProxy) { }
    @Post("signup")
    async signUp(@Body() dto: CreateAuthDto) {
        return this.authClient.send("auth.signup", dto);
    }

    @Post("login")
    async logIn(@Body() dto: LoginAuthDto) {
        return this.authClient.send("auth.login", dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("profile")
    async getOwnProfile(@Req() req: Request) {
        const id = (req as any).user.id;
        return this.authClient.send("auth.profile", id);

    }
}
