import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { User } from '../user.entity';

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isActive: true,
  posts: [],
}));
