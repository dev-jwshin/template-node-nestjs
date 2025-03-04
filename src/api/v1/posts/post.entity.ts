import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EntityType } from '../../../common/base/dynamic-service.factory';
import { Response } from '../../../common/decorators/response.decorator';

@Entity()
export class Post implements EntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Response()
  title: string;

  @Column('text')
  @Response()
  content: string;

  @Column({ default: false })
  @Response()
  published: boolean;

  @CreateDateColumn()
  @Response()
  createdAt: Date;

  @UpdateDateColumn()
  @Response()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'authorId' })
  @Response()
  author: User;

  @Column()
  @Response()
  authorId: number;
}
