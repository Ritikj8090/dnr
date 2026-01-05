import { sidebarList } from "@/constant";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronsUpDown, LogOutIcon, User2Icon } from "lucide-react";
import { logout } from "@/lib/apis";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = window.location.pathname;
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="border-r min-w-60 pb-5 pr-2 pl-4 sm:pl-8 h-[calc(100vh-64px)]">
      <ul className="flex flex-col h-full space-y-5">
        {sidebarList.map(
          (sidebar) =>
            sidebar.access.includes(user.role as string) && (
              <li key={sidebar.name}>
                <a
                  href={sidebar.url}
                  className={cn(
                    "flex items-center gap-3 font-semibold text-muted-foreground hover:text-primary",
                    {
                      "text-primary": pathname === sidebar.url,
                    }
                  )}
                >
                  {sidebar.icon}
                  {sidebar.name}
                </a>
              </li>
            )
        )}
        <div className="mt-auto space-y-5 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className=" w-full">
              <Card className=" py-3 w-full">
                <CardContent className=" p-0 px-2 w-full flex justify-between items-center">
                  <div className="flex gap-2">
                    <Avatar className=" h-10 w-10">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className=" text-start">
                      <p className=" font-semibold">{user.fullName}</p>
                      <p className=" text-muted-foreground text-sm">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <ChevronsUpDown size={18} />
                </CardContent>
              </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User2Icon /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              >
                <LogOutIcon /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
