import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dtos/signup-dto';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { LogInDto } from './dtos/login-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(@Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE) private readonly authClient: ClientProxy) { }
    @Post("signup")
    async signUp(@Body() dto: SignUpDto) {
        return this.authClient.send("auth.signup", dto);
    }

    @Post("login")
    async logIn(@Body() dto: LogInDto) {
        return this.authClient.send("auth.login", dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("profile")
    async getOwnProfile(@Req() req: Request) {
        const id = (req as any).user.id;
        return id;
    }
}
