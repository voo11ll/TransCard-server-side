import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }



    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }

  async updateProfile(userId: string, updateData: { name?: string, newPassword?: string }): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (updateData.name) {
      user.name = updateData.name;
    }
  
    await user.save();

    return { message: 'Profile updated successfully' };
  }
}
