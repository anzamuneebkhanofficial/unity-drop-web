/** @format */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Menu, LogIn, UserPlus, LogOut, LayoutDashboard, User, ShieldCheck, X, ChevronRight } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  const donorUser = useDonorAuthStore((state) => state.user);
  const patientUser = usePatientAuthStore((state) => state.user);
  const adminUser = useAdminAuthStore((state) => state.user);

  const donorLogout = useDonorAuthStore((state) => state.logout);
  const patientLogout = usePatientAuthStore((state) => state.logout);
  const adminLogout = useAdminAuthStore((state) => state.logout);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  let activeUser = null;
  let role = null;
  let logoutFunc = null;
  if (donorUser) {
    activeUser = donorUser;
    role = 'Donor';
    logoutFunc = donorLogout;
  } else if (patientUser) {
    activeUser = patientUser;
    role = 'Patient';
    logoutFunc = patientLogout;
  } else if (adminUser) {
    activeUser = adminUser;
    role = adminUser?.isSuperAdmin ? 'Super Admin' : 'Admin';
    logoutFunc = adminLogout;
  }
  // console.log("admin ??:", adminUser?.fullName);
  const isSuperAdmin = role === 'Super Admin';

  const handleLogout = async () => {
    if (logoutFunc) {
      await logoutFunc();
      router.push('/');
      router.refresh();
    }
  };
  const getDashboardLink = () => {
    if (role === 'Donor') return '/donor/dashboard';
    if (role === 'Patient') return '/patient/dashboard';
    if (role === 'Admin' || role === 'Super Admin') return '/admin/dashboard';
    return '/';
  };
  return (
    <header className="bg-bg/40 backdrop-blur-[40px] sticky top-0 z-[100] border-b border-white/5 transition-all duration-300 w-full">
      <div className="flex justify-between items-center px-6 lg:px-12 py-4 gap-4 lg:gap-8 w-full max-w-[2000px] mx-auto overflow-x-hidden">
        <Link href="/" className="flex items-center gap-4 group flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-[0_0_20px_rgba(var(--donor-hex),0.3)] border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
              <span className="text-white font-black text-xl tracking-tighter italic drop-shadow-md">U</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-white leading-none group-hover:text-donor transition-colors">
              UNITYDROP
            </span>
            <span className="text-[9px] uppercase font-black tracking-widest text-text-dim mt-1">
              Medical Network
            </span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center lg:space-x-5 xl:space-x-8">
          <Link
            href="/#features"
            className="text-text-muted hover:text-white transition-colors font-medium text-sm"
          >
            Features
          </Link>
          <Link
            href="/#howitworks"
            className="text-text-muted hover:text-white transition-colors font-medium text-sm"
          >
            How It Works
          </Link>
          <Link
            href="/#blood-info"
            className="text-text-muted hover:text-white transition-colors font-medium text-sm"
          >
            Blood Info
          </Link>
          <Link
            href="/#faq"
            className="text-text-muted hover:text-white transition-colors font-medium text-sm"
          >
            FAQ
          </Link>
          <Link
            href="/#contact"
            className="text-text-muted hover:text-white transition-colors font-medium text-sm"
          >
            Contact
          </Link>
          {isMounted && !activeUser && (
            <Link
              href="/public-feedback"
              className="text-highlight/80 hover:text-highlight transition-colors font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-highlight/5 rounded-full border border-highlight/10"
            >
              System Feedback
            </Link>
          )}
        </nav>
        <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
          {isMounted && activeUser ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`rounded-full px-5 py-2.5 font-bold transition-all duration-300 border h-auto ${isSuperAdmin
                      ? 'bg-highlight/10 hover:bg-highlight/20 border-highlight/40 text-highlight shadow-[0_0_15px_rgba(var(--highlight-hex),0.15)]'
                      : 'bg-surface-3 hover:bg-surface-2 border-white/10 text-white'
                    }`}
                >
                  {isSuperAdmin ? <ShieldCheck className="w-4 h-4 mr-2" /> : <User className={`w-4 h-4 mr-2 ${role === 'Donor' ? 'text-donor' : 'text-highlight'}`} />}
                  <span className="max-w-[100px] truncate">{activeUser.fullName || 'User'}</span>
                </Button>

              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface border-white/10 text-text-muted w-64 shadow-2xl animate-in fade-in zoom-in-95 duration-300 rounded-2xl p-2">
                <DropdownMenuLabel className="font-normal px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none text-white flex items-center gap-2">
                      {activeUser.fullName}
                      {isSuperAdmin && <ShieldCheck className="w-3 h-3 text-highlight" />}
                    </p>
                    <p className={`text-[10px] leading-none uppercase tracking-[0.2em] font-black mt-1.5 ${role === 'Donor' ? 'text-donor' : 'text-highlight'}`}>
                      {role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                <DropdownMenuItem asChild className={`cursor-pointer py-2 ${role === 'Donor' ? 'focus:bg-donor' : 'focus:bg-highlight'} focus:text-black`}>
                  <Link href={getDashboardLink()} className="w-full flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="focus:bg-donor/80 focus:text-white cursor-pointer py-2 text-donor"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-text-muted hover:text-white hover:bg-white/10 font-bold px-4">
                    Log In
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-surface border-white/10 text-text-muted w-48 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <DropdownMenuItem asChild className="focus:bg-highlight focus:text-black cursor-pointer py-2 font-medium">
                    <Link href="/patient/login" className="w-full">Patient Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-highlight focus:text-black cursor-pointer py-2 font-medium">
                    <Link href="/donor/login" className="w-full">Donor Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-highlight focus:text-black cursor-pointer py-2 font-medium">
                    <Link href="/admin/login" className="w-full">Admin Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-highlight hover:bg-highlight/80 text-black font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-highlight/20 px-6">
                    Register
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-surface border-white/10 text-text-muted w-48 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <DropdownMenuItem asChild className="focus:bg-highlight focus:text-black cursor-pointer py-2 font-medium">
                    <Link href="/patient/register" className="w-full">Register as Patient</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-highlight focus:text-black cursor-pointer py-2 font-medium">
                    <Link href="/donor/register" className="w-full">Register as Donor</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-highlight focus:text-black cursor-pointer py-2 font-medium">
                    <Link href="/admin/register" className="w-full">Register as Admin</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none p-2 rounded-md hover:bg-white/10"
          >
            <Menu className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-[9999] bg-[#030303] w-screen h-full min-h-[100dvh] flex flex-col transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--donor-hex),0.08),transparent_70%)] pointer-events-none"></div>
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center border border-white/10">
                <span className="text-white font-black text-xl italic">U</span>
              </div>
              <span className="font-black text-xl tracking-tighter text-white">UNITYDROP</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col space-y-2">
            <Link
              href="/#features"
              className="text-2xl font-black italic uppercase tracking-tighter text-white hover:text-donor transition-colors py-4 border-b border-white/5 flex justify-between items-center group"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
              <span className="w-2 h-2 rounded-full bg-white group-hover:bg-donor transition-colors"></span>
            </Link>
            <Link
              href="/#howitworks"
              className="text-2xl font-black italic uppercase tracking-tighter text-white hover:text-donor transition-colors py-4 border-b border-white/5 flex justify-between items-center group"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
              <span className="w-2 h-2 rounded-full bg-white group-hover:bg-donor transition-colors"></span>
            </Link>
            <Link
              href="/#blood-info"
              className="text-2xl font-black italic uppercase tracking-tighter text-white hover:text-donor transition-colors py-4 border-b border-white/5 flex justify-between items-center group"
              onClick={() => setIsMenuOpen(false)}
            >
              Blood Info
              <span className="w-2 h-2 rounded-full bg-white group-hover:bg-donor transition-colors"></span>
            </Link>
            <Link
              href="/#faq"
              className="text-2xl font-black italic uppercase tracking-tighter text-white hover:text-donor transition-colors py-4 border-b border-white/5 flex justify-between items-center group"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
              <span className="w-2 h-2 rounded-full bg-white group-hover:bg-donor transition-colors"></span>
            </Link>
            <Link
              href="/#contact"
              className="text-2xl font-black italic uppercase tracking-tighter text-white hover:text-donor transition-colors py-4 border-b border-white/5 flex justify-between items-center group"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
              <span className="w-2 h-2 rounded-full bg-white group-hover:bg-donor transition-colors"></span>
            </Link>
            {isMounted && !activeUser && (
              <Link
                href="/public-feedback"
                className="text-2xl font-black italic uppercase tracking-tighter text-highlight hover:text-white transition-colors py-4 border-b border-white/5 flex justify-between items-center group"
                onClick={() => setIsMenuOpen(false)}
              >
                System Feedback
                <span className="w-2 h-2 rounded-full bg-highlight group-hover:bg-white transition-colors"></span>
              </Link>
            )}

            <div className="pt-12 pb-20">
              {isMounted && activeUser ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-6 bg-surface-2 border border-white/10 rounded-[2rem]">
                    <div className="w-16 h-16 rounded-full bg-highlight flex items-center justify-center text-black shadow-2xl">
                      {isSuperAdmin ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
                    </div>
                    <div>
                      <p className="text-xl font-black text-white italic uppercase tracking-tighter">{activeUser.fullName}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-highlight mt-1">{role}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center justify-center w-full py-6 bg-highlight text-black font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-highlight/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center justify-center w-full py-6 bg-bg text-donor font-black uppercase tracking-widest rounded-2xl border border-donor/30"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim px-2">Access Portals</p>
                    <Link href="/patient/login" onClick={() => setIsMenuOpen(false)} className="py-5 px-8 rounded-2xl bg-surface-2 border border-white/5 text-white font-bold flex justify-between items-center group">
                      Patient Login
                      <ChevronRight className="w-5 h-5 text-text-dim group-hover:text-highlight transition-colors" />
                    </Link>
                    <Link href="/donor/login" onClick={() => setIsMenuOpen(false)} className="py-5 px-8 rounded-2xl bg-surface-2 border border-white/5 text-white font-bold flex justify-between items-center group">
                      Donor Login
                      <ChevronRight className="w-5 h-5 text-text-dim group-hover:text-donor transition-colors" />
                    </Link>
                    <Link href="/admin/login" onClick={() => setIsMenuOpen(false)} className="py-5 px-8 rounded-2xl bg-surface-2 border border-white/5 text-white font-bold flex justify-between items-center group">
                      Admin Login
                      <ChevronRight className="w-5 h-5 text-text-dim group-hover:text-white transition-colors" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <Link href="/patient/register" onClick={() => setIsMenuOpen(false)} className="py-5 px-8 rounded-2xl bg-highlight text-black font-black uppercase tracking-widest text-center shadow-2xl">
                      Patient Sign Up
                    </Link>
                    <Link href="/donor/register" onClick={() => setIsMenuOpen(false)} className="py-5 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-center shadow-2xl">
                      Donor Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
