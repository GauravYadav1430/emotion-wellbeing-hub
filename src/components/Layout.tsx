
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, CalendarCheck, User, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/emotions', label: 'Emotions', icon: <LineChart className="h-5 w-5" /> },
    { path: '/tasks', label: 'Tasks', icon: <CalendarCheck className="h-5 w-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="bg-purple-gradient rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-purple-gradient">Emotion Hub</h1>
      </div>
      <nav className="space-y-2 mt-6">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-wellness-purple text-white font-medium' 
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <aside className="hidden md:block w-64 border-r p-4">
          <NavContent />
        </aside>
      )}
      
      {/* Mobile header and navigation */}
      <div className="flex flex-col w-full">
        {isMobile && (
          <header className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-gradient rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-purple-gradient">
                Emotion Hub
              </h1>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <NavContent />
              </SheetContent>
            </Sheet>
          </header>
        )}
        
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
