import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  newsletterId?: string;
  issueId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user's notifications from localStorage when user changes
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`notifications-${user.id}`);
      if (stored) {
        // Parse stored notifications and convert date strings back to Date objects
        const parsedNotifications = JSON.parse(stored).map(
          (notification: any) => ({
            ...notification,
            date: new Date(notification.date),
          })
        );
        setNotifications(parsedNotifications);
      } else {
        // Start with sample notification for new users
        const sampleNotification = {
          id: "1",
          title: "Welcome to Papertrail!",
          message:
            "Explore newsletters and add them to your library to stay updated.",
          read: false,
          date: new Date(),
        };
        setNotifications([sampleNotification]);
      }
    } else {
      // Reset when logged out
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `notifications-${user.id}`,
        JSON.stringify(notifications)
      );
    }
  }, [user, notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
