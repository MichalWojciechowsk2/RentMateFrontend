import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IoNotifications } from "react-icons/io5";
import {
  startNotificationHub,
  onReceiveUnreadCount,
  stopNotificationHub,
} from "../api/notificationHub";
import { getUnreadCount } from "../api/notifications";
import { FaMessage } from "react-icons/fa6";

const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const { currentUser: user, token } = useAuth();
  const [unreadNoti, setUnreadNoti] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    if (token) {
      getUnreadCount().then((count) => {
        if (mounted) setUnreadNoti(count);
      });

      startNotificationHub(token).then((conn) => {
        if (!mounted || !conn) return;

        onReceiveUnreadCount((count: number) => {
          setUnreadNoti(count);
        });
      });
    }

    return () => {
      mounted = false;
      stopNotificationHub();
    };
  }, [token]);

  const linkClass = (path: string) =>
    pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition";

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center w-full">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        RentMate
      </Link>
      <div className="flex gap-6 text-lg">
        <Link to="/properties" className={linkClass("/properties")}>
          Oferty
        </Link>
        {!user && (
          <Link to="/login" className={linkClass("/login")}>
            Logowanie
          </Link>
        )}
        {!user && (
          <Link to="/register" className={linkClass("/register")}>
            Rejestracja
          </Link>
        )}
        <Link to="/add-property" className={linkClass("/add-property")}>
          Dodaj ogłoszenie
        </Link>
        {user && <Link to="/my-properties">Moje mieszkania</Link>}
        {user && <Link to="/my-rental">Mój wynajem</Link>}
        {user && <Link to="/profile"> Hello {user.email}</Link>}
        {user && (
          <Link to="/inbox" className="relative flex items-center">
            <IoNotifications className="text-2xl" />
            {unreadNoti > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadNoti}
              </span>
            )}
          </Link>
        )}
        {user && (
          <Link to="/chats" className="relative flex items-center">
            <FaMessage className="text-xl" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
