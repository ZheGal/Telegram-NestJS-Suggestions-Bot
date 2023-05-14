import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkAndCreateUpdateUser(user: any): Promise<User> {
    const { id } = user;
    const find = await this.userRepository.findOne({
      where: { id },
    });
    if (!find) {
      const created = this.userRepository.create(user);
      await this.userRepository.save(created);
    }
    Object.assign(find, user);
    await this.userRepository.save(find);
    return user;
  }
}
