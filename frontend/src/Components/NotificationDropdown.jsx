
import PropTypes from 'prop-types';
import { IoMdHeart, IoMdPersonAdd, IoMdChatbubbles, IoMdClose } from 'react-icons/io';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ open, notifications, onClose }) => {
  if (!open) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <IoMdHeart className="text-red-500" size={20} />;
      case 'follow':
        return <IoMdPersonAdd className="text-blue-500" size={20} />;
      case 'comment':
        return <IoMdChatbubbles className="text-green-500" size={20} />;
      default:
        return <IoMdChatbubbles className="text-gray-500" size={20} />;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'now';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dropdown */}
      <div className="absolute left-16 top-4 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 animate-in slide-in-from-left-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close notifications"
          >
            <IoMdClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <IoMdChatbubbles size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">When you get notifications, they&apos;ll show up here</p>
            </div>
          ) : (
            notifications.map((notification, idx) => (
              <div
                key={idx}
                className={`p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium leading-5">
                      {notification.text}
                    </p>
                    {notification.subtitle && (
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <button
              className="w-full text-blue-600 hover:text-blue-700 py-2 text-sm font-medium transition-colors"
              onClick={() => {
                // TODO: Navigate to full notifications page
                console.log('View all notifications');
                onClose();
              }}
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};

NotificationDropdown.propTypes = {
  open: PropTypes.bool.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      type: PropTypes.oneOf(['like', 'follow', 'comment']),
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      read: PropTypes.bool,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationDropdown;
