import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkAndCreateUpdateUser(user: any): Promise<User | void> {
    const { id } = user;
    const find = await this.findUserById(id);
    return find ?? (await this.createUser(user));
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
