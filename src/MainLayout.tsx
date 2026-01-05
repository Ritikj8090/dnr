"use client";
import ScrollToTop from "./components/ScrollToTop"


import { Outlet, Link, useLocation, matchPath } from "react-router-dom";
import { Phone, Mail, Star, Menu, Loader2Icon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMemo, useState } from "react";

// Auth + app shell bits
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import useAuth from "./hooks/useAuth";
import { ThemeProvider } from "./components/customer-theme";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Navbar from "./components/Navbar";
import PopUp from "./components/Popup";
import { AlertPopUp } from "./components/AlertPopUp";
import CredentialGererator from "./components/CredentialGererator";
import PdfPreview from "./components/PdfPreview";

const PUBLIC_PATHS = ["/", "/about", "/services", "/contact-us", "/login"];

export default function MainLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // auth state + check
  const { isAuthenticated, isLoading, user } = useSelector(
    (s: RootState) => s.auth
  );
  const firstName = user?.fullName?.split(" ")[0] ?? "";

  useAuth();

  // decide layout: website vs app-shell
  const isPublicRoute = useMemo(
    () =>
      PUBLIC_PATHS.some((p) =>
        matchPath({ path: p, end: true }, location.pathname)
      ),
    [location.pathname]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary/50">
        <Loader2Icon className="animate-spin" size={45} />
      </div>
    );
  }

  // ---------- Website Layout (public pages) ----------
  if (isPublicRoute) {
    const navItems = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Contact Us", path: "/contact-us" },
      ...(isAuthenticated
        ? [{ name: `${firstName}`, path: "/dashboard" }]
        : [{ name: "Login", path: "/login" }]),
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#cfd9df] flex flex-col">
        <ScrollToTop /> 
        {/* Header */}
      <header className="shadow-md  ">
  {/* Top contact bar */}
  <div className="bg-[#1E2A44] text-white py-3 hidden md:block ">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
      <div className="flex items-center gap-6">
        <a
          href="tel:+971565025206"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/10 hover:text-yellow-400 transition-all hover:scale-105"
        >
          <Phone className="w-4 h-4" />
          <span>Call: +971 545897734</span>
        </a>
        <a
          href="mailto:info@dnrtechnicalservices.com"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/10 hover:text-yellow-400 transition-all hover:scale-105"
        >
          <Mail className="w-4 h-4" />
          <span>Email: info@dnrtechnicalservices.com</span>
        </a>
      </div>
      <div className="flex items-center gap-2 text-yellow-400">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-sm font-medium">24/7 Support Available</span>
      </div>
    </div>
  </div>

  {/* Main navigation */}
  <div className=" sticky bg-gradient-to-r from-[#1E2A40] to-[#1E2A44] ">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        
        {/* Logo + Brand */}
        <div className="group relative flex items-center gap-2 cursor-pointer">
          <img
            src="/logo3.png"
            alt="DNR Logo"
            className="h-17 w-auto transition-transform group-hover:scale-105"
          />
          
        </div>

        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger className="md:hidden">
            <Menu className="w-6 h-6 text-white hover:text-yellow-400 transition-colors" />
          </SheetTrigger>
          <SheetContent className="bg-[#1E2A44] p-6 h-1/2">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium ${
                    location.pathname === item.path
                      ? "text-yellow-400"
                      : "text-white hover:text-yellow-400"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        
        <nav className="hidden md:flex items-center gap-8 sticky">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`font-medium relative group ${
                location.pathname === item.path
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              {item.name}
              
              <div
                className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                  location.pathname === item.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  </div>
</header>


        {/* Public content */}
        <main className="flex-grow bg-gradient-to-br from-[#f5f7fa] to-[#cfd9df]">
          <Outlet />
        </main>

        {/* Footer */}
        {/* Footer (full website footer) */}
        <footer className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="border-t border-slate-800 mt-2 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-400">
                  &copy; {new Date().getFullYear()} DNR Technical Services. All
                  rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4" />
                    <span>+971 565025206</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4" />
                    <span>info@dnrtechnicalservices.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ---------- App Layout (authenticated tools) ----------
  return (
    <ThemeProvider>
      <SidebarProvider>
        {/* keep your app shell exactly as it was */}
        <Navbar />
        {isAuthenticated && <AppSidebar />}

        <div className="mt-16 flex w-full h-full">
          {/* Content area scroll like before */}
          <div className="h-[calc(100vh-64px)] bg-gradient-to- from-primary/30 to-primary-foreground/30 px-3 sm:px-6 w-full overflow-auto">
            <Outlet />
          </div>
        </div>

        {/* global modals/popups */}
        <PopUp />
        <AlertPopUp />
        <CredentialGererator />
        <PdfPreview />
      </SidebarProvider>
    </ThemeProvider>
  );
}
