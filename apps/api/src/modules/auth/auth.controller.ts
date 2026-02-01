import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() body: { email: string; password: string }) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('guest')
    @HttpCode(HttpStatus.CREATED)
    async createGuest() {
        return this.authService.createGuestUser();
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verifyCredentials(@Body() body: { email: string; password: string }) {
        return this.authService.verifyCredentials(body.email, body.password);
    }
}
