import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  first_name: string;

  @Column('varchar', { length: 255, nullable: true })
  last_name?: string;

  @Column('varchar', { length: 255, nullable: true })
  username?: string;

  @Column({ default: false })
  is_banned: boolean;
}
