import { Router } from 'express';
import { listPosts, createPost, toggleLike, addComment, deletePost } from '../controllers/communityController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPostSchema, addCommentSchema } from '../validation/schemas.js';

const router = Router();

router.get('/', requireAuth, listPosts);
router.post('/', requireAuth, validate(createPostSchema), createPost);
router.post('/:id/like', requireAuth, toggleLike);
router.post('/:id/comments', requireAuth, validate(addCommentSchema), addComment);
router.delete('/:id', requireAuth, deletePost);

export default router;
