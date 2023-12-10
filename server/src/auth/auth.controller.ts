import { Body, Controller, Get, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Get('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard())
  @Get('/profile')
  async getProfile(@Request() req: any): Promise<{ name: string, email: string }> {
    const userId = req.user.id;
    const user = await this.authService.getUserProfile(userId);

    return {
      name: user.name,
      email: user.email,
    };
  }

  @UseGuards(AuthGuard())
  @Patch('/profile')
  async updateProfile(@Request() req: any, @Body() updateData: { name?: string }): Promise<{ message: string }> {
    const userId = req.user.id;
    const result = await this.authService.updateProfile(userId, updateData);
    return result;
  }
}
