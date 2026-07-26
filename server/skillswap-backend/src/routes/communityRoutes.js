import { Router } from 'express';
import { listPosts, createPost, toggleLike, addComment, deletePost } from '../controllers/communityController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listPosts);
router.post('/', requireAuth, createPost);
router.post('/:id/like', requireAuth, toggleLike);
router.post('/:id/comments', requireAuth, addComment);
router.delete('/:id', requireAuth, deletePost);

export default router;
