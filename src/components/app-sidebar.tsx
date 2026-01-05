import * as React from "react";
import { Settings, ChevronUp, ChevronRight, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"; // <— primitives from UI kit
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { sidebarList } from "@/constant"; // <— role-aware list factory (function)
import { cn } from "@/lib/utils";
import { logout } from "@/lib/apis";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = window.location.pathname;
  const { user } = useSelector((state: RootState) => state.auth);

  const role = (user?.role as "ADMIN" | "USER" | "MANAGER") ?? "USER";
  const menu = sidebarList(role);
  const items = menu
    .filter((i) => !i.access || i.access.includes(role))
    .map((i) => ({
      ...i,
      subMenu: (i.subMenu ?? []).filter(
        (s) => !s.access || s.access.includes(role)
      ),
    }));

  return (
    <Sidebar {...props} className="h-[calc(100vh-59px)] mt-[57px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((sidebar) => (
                <SidebarMenuItem key={sidebar.url}>
                  {sidebar.subMenu && sidebar.subMenu.length > 0 ? (
                    <Collapsible open className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "flex items-center gap-3 font-semibold text-muted-foreground hover:text-primary w-full h-full"
                          )}
                        >
                          {sidebar.icon}
                          <span>{sidebar.name}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenu className="ml-4 border-l border-sidebar-border pl-4">
                          {sidebar.subMenu.map((subItem) => (
                            <SidebarMenuItem key={subItem.url}>
                              <SidebarMenuButton size="sm">
                                <a
                                  href={subItem.url}
                                  className={cn(
                                    "flex items-center gap-3 font-semibold text-muted-foreground hover:text-primary w-full h-full",
                                    { "text-primary": pathname === subItem.url }
                                  )}
                                >
                                  {subItem.icon}
                                  <span>{subItem.name}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton>
                      <a
                        href={sidebar.url}
                        className={cn(
                          "flex items-center gap-3 font-semibold text-muted-foreground hover:text-primary w-full h-full",
                          { "text-primary": pathname === sidebar.url }
                        )}
                      >
                        {sidebar.icon}
                        {sidebar.name}
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.fullName?.at(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <a href={`/settings`} className=" flex items-center gap-2">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    window.location.reload();
                  }}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
