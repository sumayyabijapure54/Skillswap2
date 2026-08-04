import CommunityPost from '../models/CommunityPost.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import { notifyUser } from '../utils/notify.js';

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Mirrors CommunityPost's toJSON({ viewerId }) transform for .lean() results.
function leanPost(p, viewerId) {
  const { _id, __v, user, likes, comments, ...rest } = p;
  return {
    id: _id,
    ...rest,
    authorId: user,
    likeCount: likes.length,
    likedByMe: !!(viewerId && likes.some((id) => id.equals(viewerId))),
    comments: comments.map((c) => ({ id: c._id, authorName: c.authorName, text: c.text, createdAt: c.createdAt }))
  };
}

// GET /api/community?page=&limit=  (protected)
export async function listPosts(req, res, next) {
  try {
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 20 });

    const [posts, total] = await Promise.all([
      CommunityPost.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CommunityPost.estimatedDocumentCount()
    ]);

    res.json({
      posts: posts.map((p) => leanPost(p, req.user._id)),
      ...paginationMeta({ page, limit, total })
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/community  { text, tags?, type?, category?, title? }  (protected)
export async function createPost(req, res, next) {
  try {
    const { text, tags, type, category, title } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'text is required' });
    }

    const post = await CommunityPost.create({
      user: req.user._id,
      authorName: req.user.name,
      authorInitials: initialsOf(req.user.name) || 'ME',
      text: text.trim(),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      type: type === 'request' ? 'request' : 'offer',
      category: category || '',
      title: title || ''
    });

    res.status(201).json({ post: post.toJSON({ viewerId: req.user._id }) });
  } catch (err) {
    next(err);
  }
}

// POST /api/community/:id/like  (protected) — toggles like on/off
export async function toggleLike(req, res, next) {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const already = post.likes.some((id) => id.equals(req.user._id));
    if (already) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);

    await post.save();
    res.json({ post: post.toJSON({ viewerId: req.user._id }) });
  } catch (err) {
    next(err);
  }
}

// POST /api/community/:id/comments  { text }  (protected)
export async function addComment(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'text is required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, authorName: req.user.name, text: text.trim() });
    await post.save();

    if (post.user.toString() !== req.user._id.toString()) {
      await notifyUser({
        user: post.user,
        type: 'system',
        text: `${req.user.name} commented on your post`
      });
    }

    res.status(201).json({ post: post.toJSON({ viewerId: req.user._id }) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/community/:id  (protected — author only)
export async function deletePost(req, res, next) {
  try {
    const post = await CommunityPost.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}
