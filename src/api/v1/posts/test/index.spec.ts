import { Post } from '../post.entity';
import { postFactory } from './post.factory';
import { userFactory } from '../../users/test/user.factory';
import { User } from '../../users/user.entity';
import { saveEntity, saveEntities, api } from '../../../../config/test/test-utils';

describe('PostsController (E2E) - Index', () => {
  const API_ENDPOINT = '/api/v1/posts';

  describe('GET /api/v1/posts', () => {
    it('should return an array of posts', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 실제 데이터 생성
      const postsData = postFactory.buildList(3, { authorId: user.id, author: user });
      const posts = await saveEntities<Post>(Post, postsData);

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).get().execute();

      expect(response.body).toHaveLength(3);
      expect(response.body.map(post => post.id)).toEqual(
        expect.arrayContaining(posts.map(post => post.id)),
      );
    });

    it('should apply filters when they are provided', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 다양한 게시물 데이터 생성
      await saveEntity(
        Post,
        postFactory.build({
          published: true,
          authorId: user.id,
          author: user,
        }),
      );
      await saveEntity(
        Post,
        postFactory.build({
          published: false,
          authorId: user.id,
          author: user,
        }),
      );
      await saveEntity(
        Post,
        postFactory.build({
          published: true,
          authorId: user.id,
          author: user,
        }),
      );

      // HTTP 요청 보내기 및 응답 검증
      const response = await api()
        .endpoint(API_ENDPOINT)
        .get()
        .withFilter('published', true)
        .execute();

      expect(response.body).toHaveLength(2);
      expect(response.body.every(post => post.published === true)).toBe(true);
    });

    it('should apply authorId filter when provided', async () => {
      // 두 명의 사용자 생성
      const user1 = await saveEntity<User>(User, userFactory.build());
      const user2 = await saveEntity<User>(User, userFactory.build());

      // 각 사용자별 게시물 생성
      await saveEntity(
        Post,
        postFactory.build({
          authorId: user1.id,
          author: user1,
        }),
      );
      await saveEntity(
        Post,
        postFactory.build({
          authorId: user1.id,
          author: user1,
        }),
      );
      await saveEntity(
        Post,
        postFactory.build({
          authorId: user2.id,
          author: user2,
        }),
      );

      // HTTP 요청 보내기 및 응답 검증
      const response = await api()
        .endpoint(API_ENDPOINT)
        .get()
        .withFilter('authorId', user1.id)
        .execute();

      expect(response.body).toHaveLength(2);
      expect(response.body.every(post => post.authorId === user1.id)).toBe(true);
    });

    it('should include related author when requested', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 게시물 생성
      await saveEntity(
        Post,
        postFactory.build({
          authorId: user.id,
          author: user,
        }),
      );

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).get().withInclude('author').execute();

      expect(response.body).toHaveLength(1);
      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].author.id).toEqual(user.id);
    });

    it('should apply pagination when parameters are provided', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 많은 게시물 데이터 생성
      const postsData = postFactory.buildList(25, {
        authorId: user.id,
        author: user,
      });
      await saveEntities<Post>(Post, postsData);

      // HTTP 요청 보내기 및 응답 검증
      const response = await api().endpoint(API_ENDPOINT).get().withPagination(2, 10).execute();

      expect(response.body).toHaveLength(10);
    });
  });
});
