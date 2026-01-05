import { authNavbarList, LOGO, navbarList } from "@/constant";
import type { RootState } from "@/store";
import { Mountain } from "lucide-react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const path = window.location.pathname
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <nav className=" flex items-center justify-between sm:px-3 py-4 fixed right-5 left-5 top-0 border-b">
      <a href="/" className="flex items-center text-primary">
        <img src={LOGO} alt="logo" className="h-6 w-28 mr-2"/>
      </a>
      <ul className=" flex items-center gap-7">
        {isAuthenticated ? (
          <>
            <li key={authNavbarList[0].name}>
              <a
                href={authNavbarList[0].url}
                className={cn(" flex items-center gap-1 font-semibold text-muted-foreground hover:text-primary/90", path === authNavbarList[0].url && 'text-primary')}
              >
                {authNavbarList[0].icon}
                {authNavbarList[0].name}
              </a>
            </li>
            {user.role === "ADMIN" && (
              <li key={authNavbarList[1].name}>
                <a
                  href={authNavbarList[1].url}
                  className={cn(" flex items-center gap-1 font-semibold text-muted-foreground hover:text-primary/90", path === authNavbarList[1].url && 'text-primary')}
                >
                  {authNavbarList[1].icon}
                  {authNavbarList[1].name}
                </a>
              </li>
            )}
            {/* {user.role === "ADMIN" && (
              <Button onClick={() => dispatch(setIsAddUserOpen(true))}>
                {authNavbarList[1].icon}
                {authNavbarList[1].name}
              </Button>
            )} */}
          </>
        ) : (
          <>
            {navbarList.map((nav) => (
              <li key={nav.name}>
                <a
                  href={nav.url}
                  className=" flex items-center gap-1 font-semibold text-muted-foreground hover:text-primary/90"
                >
                  {nav.icon}
                  {nav.name}
                </a>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
