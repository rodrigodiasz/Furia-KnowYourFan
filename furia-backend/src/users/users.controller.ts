import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PointsService } from '../points/points.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly pointsService: PointsService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(
      req.user.id,
      updateUserDto,
    );

    await this.pointsService.addPoints(req.user.id, 10, 'profile_update');

    return updatedUser;
  }

  private checkSignificantUpdates(
    currentUser: any,
    updateUserDto: UpdateUserDto,
  ): boolean {
    const fieldsToCheck = [
      'address',
      'cpf',
      'interests',
      'activities',
      'events',
      'purchases',
      'steam',
      'epic',
      'origin',
      'battleNet',
      'riot',
      'xbox',
      'playstation',
      'nintendo',
    ];

    for (const field of fieldsToCheck) {
      console.log(`Checking field ${field}:`, {
        current: currentUser[field],
        update: updateUserDto[field],
      });
      if (updateUserDto[field] && !currentUser[field]) {
        console.log(`Found significant update in field ${field}`);
        return true;
      }
    }

    return false;
  }
}
