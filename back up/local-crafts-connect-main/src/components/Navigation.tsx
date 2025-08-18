
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Calendar } from "lucide-react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-brand-600">
            ServiceLocator
          </Link>
          
          <div className="hidden md:flex ml-10 space-x-8">
            <Link to="/services" className="text-gray-600 hover:text-brand-600">
              Services
            </Link>
            <Link to="/professionals" className="text-gray-600 hover:text-brand-600">
              Professionals
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-brand-600">
              How It Works
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-brand-100 text-brand-600">
                      {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bookings" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/services"
                  className="text-lg py-2 hover:text-brand-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/professionals"
                  className="text-lg py-2 hover:text-brand-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Professionals
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-lg py-2 hover:text-brand-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-lg py-2 hover:text-brand-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="text-lg py-2 hover:text-brand-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start px-0"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button asChild>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
