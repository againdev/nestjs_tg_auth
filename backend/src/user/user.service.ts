import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUuId(uuid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: uuid,
      },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    return user;
  }
}
