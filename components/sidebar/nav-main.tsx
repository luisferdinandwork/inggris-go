"use client";

import Link from "next/link";
import { LayoutDashboard, LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { collapsedNavItemClass, navIconClass, navItemClass } from "./nav-styles";

export type MainNavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isActive?: boolean;
};

export function NavMain({ items }: { items: MainNavItem[] }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup
      className={
        isCollapsed ? "items-center px-0 pt-2 pb-2" : "px-2 pt-2 pb-2"
      }
    >
      <SidebarMenu className={isCollapsed ? "items-center gap-1" : "gap-0.5"}>
        {items.map((item) => {
          const Icon = item.icon ?? LayoutDashboard;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
                className={
                  isCollapsed
                    ? collapsedNavItemClass(item.isActive)
                    : navItemClass(item.isActive)
                }
              >
                <Link href={item.href}>
                  <Icon
                    className={
                      isCollapsed
                        ? "!size-[18px] shrink-0"
                        : navIconClass(item.isActive)
                    }
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
