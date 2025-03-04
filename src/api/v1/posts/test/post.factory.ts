import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Post } from '../post.entity';
import { userFactory } from '../../users/test/user.factory';

export const postFactory = Factory.define<Post>(({ sequence, associations }) => {
  const author = associations.author || userFactory.build();

  return {
    id: sequence,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    published: false,
    authorId: author.id,
    author,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Post;
});
