import { User } from '../user.entity';
import { userFactory } from './user.factory';
import { postFactory } from '../../posts/test/post.factory';
import { Post } from '../../posts/post.entity';
import { saveEntity, saveEntities, api } from '../../../../config/test/test-utils';

describe('UsersController (E2E) - Index', () => {
  const API_ENDPOINT = '/api/v1/users';

  describe('GET /api/v1/users', () => {
    it('should return an array of users', async () => {
      // 실제 데이터 생성
      const usersData = userFactory.buildList(3);
      const users = await saveEntities<User>(User, usersData);

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).get().execute();

      expect(response.body).toHaveLength(3);
      expect(response.body.map(user => user.id)).toEqual(
        expect.arrayContaining(users.map(user => user.id)),
      );
    });

    it('should apply filters when they are provided', async () => {
      // 다양한 사용자 데이터 생성
      await saveEntity(User, userFactory.build({ name: '홍길동' }));
      await saveEntity(User, userFactory.build({ name: '김철수' }));
      await saveEntity(User, userFactory.build({ name: '홍길동' }));

      // HTTP 요청 보내기 및 응답 검증
      const response = await api()
        .endpoint(API_ENDPOINT)
        .get()
        .withFilter('name', '홍길동')
        .execute();

      expect(response.body).toHaveLength(2);
      expect(response.body.every(user => user.name === '홍길동')).toBe(true);
    });

    it('should include related posts when requested', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 게시물 생성
      await saveEntity(Post, postFactory.build({ authorId: user.id, author: user }));
      await saveEntity(Post, postFactory.build({ authorId: user.id, author: user }));

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).get().withInclude('posts').execute();

      const foundUser = response.body.find(u => u.id === user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser.posts).toBeDefined();
      expect(foundUser.posts).toHaveLength(2);
    });

    it('should apply pagination when parameters are provided', async () => {
      // 많은 사용자 데이터 생성
      const usersData = userFactory.buildList(25);
      await saveEntities<User>(User, usersData);

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).get().withPagination(2, 10).execute();

      expect(response.body).toHaveLength(10);
    });
  });
});
