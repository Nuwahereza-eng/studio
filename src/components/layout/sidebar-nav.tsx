
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Droplets,
  CreditCard,
  Settings,
  Sparkles,
  ClipboardList,
  DollarSign,
  Briefcase,
  LogOut, // Added LogOut icon
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmers', label: 'Farmers', icon: Users },
  { href: '/deliveries', label: 'Milk Deliveries', icon: Droplets },
  {
    label: 'Payments',
    icon: CreditCard,
    subItems: [
      { href: '/payments/reports', label: 'Payment Reports', icon: ClipboardList },
      { href: '/payments/farmer-view', label: 'Farmer Statements', icon: DollarSign },
    ],
  },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <Logo className="text-sidebar-foreground group-data-[collapsible=icon]:hidden" />
          <SidebarTrigger className="hidden md:flex group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            item.subItems ? (
              <SidebarGroup key={item.label}>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarGroupLabel>
                 {item.subItems.map((subItem) => (
                  <SidebarMenuItem key={subItem.href}>
                    <Link href={subItem.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === subItem.href || (pathname.startsWith(subItem.href) && subItem.href !== '/')}
                        tooltip={{ children: subItem.label, side: 'right', className: 'ml-2' }}
                        className="justify-start"
                      >
                        <a>
                          <subItem.icon />
                          <span className="group-data-[collapsible=icon]:hidden">{subItem.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            ) : (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
                    tooltip={{ children: item.label, side: 'right', className: 'ml-2' }}
                    className="justify-start"
                  >
                    <a>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        <Button variant="secondary" className="w-full group-data-[collapsible=icon]:hidden"> {/* Changed variant to secondary */}
          <LogOut className="mr-2 h-4 w-4" /> {/* Added LogOut icon */}
          Log Out
        </Button>
         <Button variant="ghost" size="icon" className="hidden group-data-[collapsible=icon]:flex mx-auto" tooltip={{children: "Log Out", side: "right", className: "ml-2"}}>
          <LogOut /> {/* Changed icon to LogOut */}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
