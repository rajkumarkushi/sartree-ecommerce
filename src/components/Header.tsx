import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  ShoppingCart,
  LogIn,
  LogOut,
  UserCog,
  Key,
  Menu,
  X,
} from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart(); // ✅ fixed: use function from CartContext
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartCount = getItemCount(); // ✅ correct and live updating for guest & logged user

  // Close profile menu on outside click
  useEffect(() => {
    const close = () => setShowProfileMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const initials = user
    ? (user.username || user.email || "U").slice(0, 2).toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: Logo + mobile menu toggle */}
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle Menu"
          >
            {showMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            className="text-xl font-bold text-green-700 hover:text-green-800"
          >
            SAR TREE
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="hover:text-green-700">
            Home
          </Link>
          <Link to="/products" className="hover:text-green-700">
            Products
          </Link>
          <Link to="/blog" className="hover:text-green-700">
            Blog
          </Link>
          <Link to="/about" className="hover:text-green-700">
            About
          </Link>
          <Link to="/contact" className="hover:text-green-700">
            Contact
          </Link>
        </nav>

        {/* Right: Search + Cart + Auth/Profile */}
        <div className="flex items-center gap-3">
          {/* 🔍 Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2 rounded-full border px-3 py-1.5"
          >
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-56 flex-1 bg-transparent outline-none"
            />
          </form>

          {/* 🛒 Cart */}
          <Link
            to="/cart"
            className="relative flex items-center rounded-full border px-3 py-1.5 hover:bg-gray-50"
            title="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-700 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 👤 Auth/Profile */}
          {user ? (
            <div
              className="relative"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
            >
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white font-semibold hover:bg-green-800"
                title="Profile"
              >
                {initials}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg">
                  <div className="flex flex-col divide-y">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <UserCog size={16} />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/change-password");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Key size={16} />
                      Change Password
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/orders");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <UserCog size={16} />
                      My Orders
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-green-700 px-3 py-1.5 text-white hover:bg-green-800"
              title="Sign In"
            >
              <LogIn size={18} />
              <span className="hidden md:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-3">
            {/* Search in mobile */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 rounded-md border px-3 py-2"
            >
              <Search size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-800"
              >
                Go
              </button>
            </form>

            {/* Links */}
            <div className="grid gap-2">
              <Link to="/" className="rounded-md px-2 py-2 hover:bg-gray-50">
                Home
              </Link>
              <Link
                to="/products"
                className="rounded-md px-2 py-2 hover:bg-gray-50"
              >
                Products
              </Link>
              <Link to="/blog" className="rounded-md px-2 py-2 hover:bg-gray-50">
                Blog
              </Link>
              <Link
                to="/about"
                className="rounded-md px-2 py-2 hover:bg-gray-50"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="rounded-md px-2 py-2 hover:bg-gray-50"
              >
                Contact
              </Link>
            </div>

            {/* Auth controls (mobile) */}
            <div className="border-t pt-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <UserCog size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate("/change-password")}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <Key size={16} />
                    Change Password
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <UserCog size={16} />
                    My Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-white hover:bg-green-800"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
