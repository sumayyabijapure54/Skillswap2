import Notification from '../models/Notification.js';
import { getIO } from '../realtime/io.js';

// Every place that used to call `Notification.create(...)` directly should
// call this instead: same DB write, plus a real-time push to that user if
// they have a socket connected. Each authenticated socket joins a room
// named after their own user id (see server.js), so emitting to that room
// reaches every tab/device they currently have open.
export async function notifyUser({ user, type, text, link = null }) {
  const notification = await Notification.create({ user, type, text, link });

  getIO()?.to(user.toString()).emit('notification:new', notification.toJSON());

  return notification;
}
