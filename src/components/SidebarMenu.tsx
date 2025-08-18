import React from 'react';
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon, MessageCircle, CalendarCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';

/**
 * SidebarMenu provides navigation links for the main app sections.
 * - Settings
 * - Messages
 * - Booked Service Providers
 */
const SidebarMenuComponent: React.FC = () => {
  const location = useLocation();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <span className="text-xl font-bold">Menu</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/settings">
                <SidebarMenuButton isActive={location.pathname === '/settings'}>
                  <SettingsIcon className="mr-2" />
                  Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/messages/1">
                <SidebarMenuButton isActive={location.pathname.startsWith('/messages')}>
                  <MessageCircle className="mr-2" />
                  Messages
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/bookings">
                <SidebarMenuButton isActive={location.pathname === '/bookings'}>
                  <CalendarCheck className="mr-2" />
                  Booked Service Providers
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Tippy</span>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

// Drawer version for mobile/hamburger
export const SidebarMenuDrawer: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-64 max-w-full">
        <SheetTitle className="sr-only">Main Menu</SheetTitle>
        <SheetDescription className="sr-only">Navigation drawer for main app sections</SheetDescription>
        <SidebarMenuComponent />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMenuComponent; 