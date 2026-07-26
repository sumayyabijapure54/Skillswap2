import User from '../models/User.js';

// POST /api/wishlist/:skillId/toggle  (protected)
export async function toggleWishlist(req, res, next) {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user._id);

    const idx = user.wishlist.indexOf(skillId);
    if (idx === -1) user.wishlist.push(skillId);
    else user.wishlist.splice(idx, 1);

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
}
