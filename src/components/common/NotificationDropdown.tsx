import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { X, CheckCircle, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Animate in
      gsap.fromTo(
        dropdownRef.current,
        { 
          opacity: 0,
          y: -20
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }
      );
    }
  }, [isOpen]);

  const handleNotificationClick = (id: string, newsletterId?: string, issueId?: string) => {
    markAsRead(id);
    
    if (newsletterId && issueId) {
      navigate(`/read/${newsletterId}/${issueId}`);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-start justify-center">
      <div 
        ref={dropdownRef}
        className="bg-white rounded-lg shadow-xl mt-20 w-full max-w-md mx-4 max-h-[70vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <div className="flex items-center">
            <Bell size={18} className="text-primary-600 mr-2" />
            <h3 className="font-medium text-lg">Notifications</h3>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${!notification.read ? 'bg-primary-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id, notification.newsletterId, notification.issueId)}
                >
                  <div className="flex items-start">
                    {!notification.read ? (
                      <span className="h-2 w-2 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    ) : (
                      <span className="h-2 w-2 mr-2 flex-shrink-0"></span>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CheckCircle size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationDropdown;