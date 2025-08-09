import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shallow } from "zustand/shallow";
import {
  Search,
  Home,
  Play,
  Star,
  Tv,
  Plus,
  Menu,
  X,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip";
import { useTheme, useScrollDirection } from "@/hooks";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import logo from "@/Assets/Images/logo.png";

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useAppStore(
    (state) => ({
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
    }),
    shallow
  );
  const scrollDirection = useScrollDirection();

  const menuItems: NavItem[] = [
    { name: "HOME", icon: Home, active: true },
    { name: "SEARCH", icon: Search },
    { name: "WATCHLIST", icon: Plus },
    { name: "ORIGINALS", icon: Star },
    { name: "MOVIES", icon: Play },
    { name: "SERIES", icon: Tv },
  ];

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: scrollDirection === "down" ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-background/80 backdrop-blur-lg border-b border-border"
        )}
      >
        <div className="container-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <img
                src={logo}
                alt="Disney+"
                className="h-8 md:h-12 w-auto object-contain"
              />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                        "hover:text-disney-blue hover:bg-disney-blue/10",
                        item.active && "text-disney-blue"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="hidden xl:block">{item.name}</span>
                      {item.active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-disney-blue rounded-full"
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <motion.div
                  animate={{
                    scale: isSearchFocused ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search movies, TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={cn(
                      "pl-10 pr-4 py-2 bg-secondary/50 border-0 rounded-full",
                      "focus:bg-secondary focus:ring-2 focus:ring-disney-blue/50",
                      "transition-all duration-200"
                    )}
                  />
                </motion.div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="hidden sm:flex items-center space-x-2">
                {themeOptions.map((option) => (
                  <Tooltip key={option.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={theme === option.value ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                        className="h-8 w-8"
                      >
                        <option.icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{option.label} Mode</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {/* TODO: Implement mobile search */}}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border"
            >
              <div className="container-padding py-4 space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start space-x-3 py-3 text-left",
                      item.active && "bg-disney-blue/10 text-disney-blue"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Button>
                ))}

                {/* Mobile Search */}
                <div className="pt-4 md:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search movies, TV shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary/50 border-0 rounded-full"
                    />
                  </div>
                </div>

                {/* Mobile Theme Toggle */}
                <div className="pt-4 sm:hidden">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Theme</span>
                    <div className="flex space-x-2">
                      {themeOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={theme === option.value ? "default" : "ghost"}
                          size="icon"
                          onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                          className="h-8 w-8"
                        >
                          <option.icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </TooltipProvider>
  );
};

export default Header;
