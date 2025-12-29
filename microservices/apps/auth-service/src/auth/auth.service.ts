import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs'

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService, private readonly configService: ConfigService) { };


    async signup(dto: CreateAuthDto): Promise<{ access_token: string, refresh_token: string }> {
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException();
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10)
        const user = await this.prisma.user.create({
            data: {

                hashedPassword: hashedPassword,
                email: dto.email,

            }
        })
        if (!user) {
            throw new InternalServerErrorException();
        }

        const access_token = this.jwtService.sign({ userId: user.id });
        const refresh_token = this.jwtService.sign({ userId: user.id }, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d'
        },
        );
        return { access_token, refresh_token };
    }

    async login(dto: LoginAuthDto): Promise<{ access_token: string, refresh_token: string }> {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new NotFoundException();
        }
        const isGood = await bcrypt.compare(dto.password, user.hashedPassword);
        if (!isGood) throw new InternalServerErrorException();
        const access_token = this.jwtService.sign({ userId: user.id });
        const refresh_token = this.jwtService.sign({ userId: user.id }, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d'
        },
        );

        return { access_token, refresh_token };
    }

    async createTokenForRefresh(user: User): Promise<string> {
        return this.jwtService.sign({ userId: user.id })
    }
}
