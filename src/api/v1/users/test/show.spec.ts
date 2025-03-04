import { User } from '../user.entity';
import { userFactory } from './user.factory';
import { postFactory } from '../../posts/test/post.factory';
import { Post } from '../../posts/post.entity';
import { saveEntity, api } from '../../../../config/test/test-utils';

describe('UsersController (E2E) - Show', () => {
  const API_ENDPOINT = '/api/v1/users';

  describe('GET /api/v1/users/:id', () => {
    it('should return a single user by id', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).id(user.id).get().execute();

      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(user.id);
    });

    it('should return 404 when user is not found', async () => {
      // 존재하지 않는 사용자 ID
      const nonExistentId = 9999;

      // HTTP 요청 보내기 및 응답 검증 (404 기대)
      await api().endpoint(API_ENDPOINT).id(nonExistentId).get().expectStatus(404).execute();
    });

    it('should include related posts when requested', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 게시물 생성
      await saveEntity(Post, postFactory.build({ authorId: user.id, author: user }));
      await saveEntity(Post, postFactory.build({ authorId: user.id, author: user }));

      // HTTP 요청 보내기 및 응답 검증
      const response = await api()
        .endpoint(API_ENDPOINT)
        .id(user.id)
        .get()
        .withInclude('posts')
        .execute();

      expect(response.body).toBeDefined();
      expect(response.body.posts).toBeDefined();
      expect(response.body.posts).toHaveLength(2);
    });
  });
});
