import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const { currentUser: user } = useAuth();

  useEffect(() => {
    console.log(`Current user:`, user);
  }, [user]);

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
      </div>
    </nav>
  );
};

export default NavBar;
