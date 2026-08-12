import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    const notifications = await Notification.find({ recipientId: userId })
      .populate('senderId', 'name avatarUrl')
      .populate('productId', 'name logoUrl')
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

    return res.json({ notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function markAllRead(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    await Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
    return res.json({ message: 'Toutes les notifications ont été marquées comme lues.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function sendNotification({ recipientId, senderId, productId, type, message }) {
  try {
    if (!recipientId || recipientId.toString() === senderId.toString()) return;
    await Notification.create({
      recipientId,
      senderId,
      productId,
      type,
      message
    });
  } catch (err) {
    console.error('Error creating notification:', err.message);
  }
}
