
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Tent, 
  AlertTriangle, 
  UserPlus, 
  LogIn, 
  User,
  Menu,
  X
} from "lucide-react";

// Mock auth - will be replaced with real auth later
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // For demo purposes only - toggle auth status by clicking on the login button
  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };
  
  const setAdmin = () => {
    setIsAuthenticated(true);
    setIsAdmin(true);
  };

  return { isAuthenticated, isAdmin, login, logout, setAdmin };
};

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: "/", icon: <Home className="mr-2 h-4 w-4" />, label: "Home" },
    { path: "/camps", icon: <Tent className="mr-2 h-4 w-4" />, label: "Camps" },
    { path: "/urgent", icon: <AlertTriangle className="mr-2 h-4 w-4" />, label: "Urgent Need" },
    { path: "/donor", icon: <UserPlus className="mr-2 h-4 w-4" />, label: "Register as Donor" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-blood-600 font-bold text-2xl">
              PaAr <span className="text-blood-700">BloodConnect</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              className={location.pathname === item.path ? "bg-blood-600 hover:bg-blood-700" : ""}
              asChild
            >
              <Link to={item.path} className="flex items-center">
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm" className="border-blood-600 text-blood-600" asChild>
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}
            </>
          ) : (
            <Button variant="outline" size="sm" className="border-blood-600 text-blood-600" asChild>
              <Link to="/login" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Login / Register
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden py-2 shadow-lg">
          <div className="container px-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  location.pathname === item.path ? "bg-blood-600 hover:bg-blood-700" : ""
                }`}
                asChild
              >
                <Link to={item.path} className="flex items-center">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}

            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-blood-600 text-blood-600"
                    asChild
                  >
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-blood-600 text-blood-600"
                asChild
              >
                <Link to="/login" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Register
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
