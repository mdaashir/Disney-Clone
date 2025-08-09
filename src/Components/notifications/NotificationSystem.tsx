import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, Info, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

/* eslint-disable react-refresh/only-export-components */
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 means persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  // eslint-disable-next-line no-unused-vars
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
  // eslint-disable-next-line no-unused-vars
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // eslint-disable-next-line no-unused-vars
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      duration: notification.duration ?? 5000, // default 5 seconds
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    // In a real app, you would mark as read in the backend
    removeNotification(id);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

// Helper function for icons
const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <Check className="h-5 w-5" />;
    case "error":
      return <AlertCircle className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" />;
    case "info":
    default:
      return <Info className="h-5 w-5" />;
  }
};

// Notification Toast Component
export function NotificationToast() {
  const { notifications, removeNotification } = useNotifications();

  const getColors = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.slice(0, 5).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.3 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "min-w-80 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
              getColors(notification.type),
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold">{notification.title}</h4>
                <p className="text-sm mt-1 opacity-90">
                  {notification.message}
                </p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-sm font-medium underline hover:no-underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Notification Bell Component
export function NotificationBell() {
  const { notifications, clearAllNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-1 rounded-full",
                          notification.type === "success" && "text-green-500",
                          notification.type === "error" && "text-red-500",
                          notification.type === "warning" && "text-yellow-500",
                          notification.type === "info" && "text-blue-500",
                        )}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Intl.RelativeTimeFormat("en", {
                            numeric: "auto",
                          }).format(
                            Math.round(
                              (notification.createdAt.getTime() - Date.now()) /
                                (1000 * 60),
                            ),
                            "minute",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
