import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { EntityType } from '../../../common/base/dynamic-service.factory';
import { Response } from '../../../common/decorators/response.decorator';

@Entity()
export class User implements EntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Response()
  name: string;

  @Column()
  @Response()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  @Response()
  isActive: boolean;

  @CreateDateColumn()
  @Response()
  createdAt: Date;

  @UpdateDateColumn()
  @Response()
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  @Response()
  posts: Post[];
}
