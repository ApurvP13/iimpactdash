"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./theme-button";
import { BookOpen, FileText } from "lucide-react";
import Image from "next/image";
import { NavDrops } from "./nav-drops";

const sidebarConfig = {
  navMain: [
    {
      title: "Blogs",
      icon: BookOpen,
      items: [
        { title: "New Blog", url: "/blogs/new" },
        { title: "Manage", url: "/blogs" },
      ],
    },
    {
      title: "PYQs",
      icon: FileText,
      items: [
        { title: "New Paper", url: "/pyqs/new" },
        { title: "Manage", url: "/pyqs" },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <Image
                  src="https://avatar.vercel.sh/iimpact"
                  alt="IIMpact"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <span className="font-mono font-semibold">
                  IIMpact Enterprise
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavDrops items={sidebarConfig.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
