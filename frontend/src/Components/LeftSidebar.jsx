import { CiHome } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePostFocus } from "../hooks/usePostFocus.js";
import { useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import useNotifications from "../hooks/useNotifications";

const menu = [
  {
    label: "Home",
    icon: <CiHome size={28} />,
    to: "/",
  },
  {
    label: "Notifications",
    icon: <IoIosNotificationsOutline size={28} />,
    to: "/notifications",
  },
  {
    label: "Bookmarks",
    icon: <CiBookmark size={28} />,
    to: "/bookmarks",
  },
  {
    label: "Profile",
    icon: <CiUser size={28} />,
    to: "/profile",
  },
  {
    label: "Logout",
    icon: <AiOutlineLogout size={28} />,
    to: "/logout",
  },
];

const LeftSidebar = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const { focusPostInput } = usePostFocus();

  // Notification dropdown state
  const [notifOpen, setNotifOpen] = useState(false);
  // Real notifications
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleNotifClick = () => setNotifOpen((prev) => !prev);

  // When opening the dropdown, refresh notifications and unread count
  useEffect(() => {
    if (notifOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [notifOpen, fetchNotifications, fetchUnreadCount]);

  const handleNotificationItemClick = async (notification) => {
    try {
      if (!notification.isRead && notification._id) {
        await markAsRead(notification._id);
        await fetchUnreadCount();
      }
      // TODO: optional navigation based on notification.relatedPost/_id
    } catch (_) {
      // no-op
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchUnreadCount();
    } catch (_) {
      // no-op
    }
  };

  const handlePostClick = () => {
    navigate("/");
    setTimeout(() => {
      focusPostInput();
    }, 100);
  }
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Optionally handle error
    }
    localStorage.removeItem("xCloneUser");
    localStorage.removeItem("xClone"); // Remove old token if exists
    setAuthUser(null);
    navigate("/login");
  };

  return (
    <>
      <div className="px-4 py-2 h-full">
        <div className="flex flex-col items-start max-lg:items-center gap-2 py-4">
          <img
            className="ml-5 max-lg:ml-0 h-8"
            src="https://imgs.search.brave.com/ZhDTc19u3Xv8PyZhNmN3n3svlp1Wr_pndpywRRjXxjU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA2/L1R3aXR0ZXItTG9n/JUQwJUJFLTUwMHgy/ODEucG5n"
            alt="Twitter-Logo"
          />
          <div className="flex flex-col gap-2 w-full items-start">
            {menu.map((item) => {
              const itemClasses = "flex items-center gap-4 w-full px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full transition-colors duration-200 max-lg:w-fit max-lg:px-2";

              if (item.label === "Notifications") {
                return (
                  <div key={item.label} className="relative w-full">
                    <button
                      type="button"
                      className={itemClasses + " relative"}
                      onClick={handleNotifClick}
                      aria-label="Show notifications"
                    >
                      <div className="relative">
                        {item.icon}
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-lg max-lg:hidden">{item.label}</span>
                    </button>
                    <NotificationDropdown
                      open={notifOpen}
                      notifications={notifications}
                      onClose={() => setNotifOpen(false)}
                      onItemClick={handleNotificationItemClick}
                      onMarkAllRead={handleMarkAllAsRead}
                    />
                  </div>
                );
              }


              if (item.label === "Logout") {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className={itemClasses}
                  >
                    {item.icon}
                    <span className="font-semibold text-lg max-lg:hidden">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  to={item.to}
                  key={item.label}
                  className={itemClasses}
                >
                  {item.icon}
                  <span className="font-semibold text-lg max-lg:hidden">{item.label}</span>
                </Link>
              );
            })} 
            <button onClick={handlePostClick} className="px-4 py-2 border-none text-md bg-[#1D9BF0] w-full rounded-full text-white font-bold max-lg:w-12 max-lg:px-0 max-lg:flex max-lg:items-center max-lg:justify-center max-lg:mx-auto">
              <span className="max-lg:hidden">Post</span>
              <svg className="hidden max-lg:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c.414 0 .75.336.75.75V11.25h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5H5.75a.75.75 0 0 1 0-1.5h5.5V5.75c0-.414.336-.75.75-.75Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
