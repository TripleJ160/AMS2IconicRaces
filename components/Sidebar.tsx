'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { CareerModal } from '@/components/CareerModal';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import WhatsNewModal from '@/components/WhatsNewModal';

/**
 * Sidebar Component
 * Persistent left navigation with brand logo, main navigation, and user section
 * Collapses to hamburger menu on mobile viewports (<768px)
 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isWhatsNewModalOpen, setIsWhatsNewModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Hide sidebar on race detail pages
  const isRaceDetailPage = pathname.startsWith('/race/');

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const openCareerModal = () => {
    setIsCareerModalOpen(true);
    closeSidebar();
  };
  const closeCareerModal = () => setIsCareerModalOpen(false);
  const openLeaderboardModal = () => {
    setIsLeaderboardModalOpen(true);
    closeSidebar();
  };
  const closeLeaderboardModal = () => setIsLeaderboardModalOpen(false);
  const openWhatsNewModal = () => {
    setIsWhatsNewModalOpen(true);
    closeSidebar();
  };
  const closeWhatsNewModal = () => setIsWhatsNewModalOpen(false);

  // Don't render sidebar on race detail pages
  if (isRaceDetailPage) {
    return (
      <>
        <CareerModal isOpen={isCareerModalOpen} onClose={closeCareerModal} />
        <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={closeLeaderboardModal} />
        <WhatsNewModal isOpen={isWhatsNewModalOpen} onClose={closeWhatsNewModal} />
      </>
    );
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-background-secondary/90 backdrop-blur-md border border-glass-border rounded-lg hover:bg-background-tertiary transition-colors"
        aria-label="Toggle navigation menu"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-background-secondary/95 backdrop-blur-md
          border-r border-glass-border z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header Section */}
        <header className="p-6 border-b border-glass-border">
          <div className="flex items-center gap-3">
            {/* Red accent bar */}
            <div className="w-1 h-10 bg-accent-red shadow-[0_0_10px_rgba(220,0,0,0.6)]" />
            
            {/* Brand title */}
            <div>
              <h1 className="font-display text-xl tracking-wider uppercase text-white">
                AMS2
              </h1>
              <p className="text-xs text-text-secondary uppercase tracking-wide">
                Iconic Races
              </p>
            </div>
          </div>
        </header>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            href="/"
            icon={<GalleryIcon />}
            label="Gallery"
            isActive={pathname === '/'}
            onClick={closeSidebar}
          />
          <NavLink
            href="/championships"
            icon={<TrophyIcon />}
            label="Championships"
            isActive={pathname.startsWith('/championships')}
            onClick={closeSidebar}
          />
          <NavLink
            href="/discovery"
            icon={<CompassIcon />}
            label="Discovery"
            isActive={pathname === '/discovery'}
            onClick={closeSidebar}
          />
          <NavLink
            href="/about"
            icon={<InfoIcon />}
            label="About"
            isActive={pathname === '/about'}
            onClick={closeSidebar}
          />
        </nav>

        {/* Footer Section - User/Auth */}
        <footer className="p-4 border-t border-glass-border space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : user ? (
            <UserSection 
              user={user} 
              onNavigate={closeSidebar} 
              onOpenCareer={openCareerModal}
              onOpenLeaderboard={openLeaderboardModal}
            />
          ) : (
            <SignInButton />
          )}
          
          {/* Version Badge */}
          <div className="text-center pt-2 border-t border-glass-border/50">
            <button
              onClick={openWhatsNewModal}
              className="text-xs text-text-secondary hover:text-accent-yellow transition-colors"
            >
              Version <span className="text-accent-yellow font-semibold">1.1.0</span>
              <span className="ml-1 text-accent-yellow/70">Beta</span>
            </button>
          </div>
        </footer>
      </aside>

      {/* Career Modal */}
      <CareerModal isOpen={isCareerModalOpen} onClose={closeCareerModal} />
      
      {/* Leaderboard Modal */}
      <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={closeLeaderboardModal} />
      
      {/* What's New Modal */}
      <WhatsNewModal isOpen={isWhatsNewModalOpen} onClose={closeWhatsNewModal} />
    </>
  );
}

/**
 * NavLink Component
 * Individual navigation link with icon and active state
 */
interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavLink({ href, icon, label, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        transition-all duration-200
        ${
          isActive
            ? 'bg-accent-red/20 text-white border-l-4 border-accent-red'
            : 'text-text-secondary hover:text-white hover:bg-background-tertiary'
        }
      `}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

/**
 * SignInButton Component
 * Button to trigger Google OAuth sign-in
 */
function SignInButton() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <GoogleIcon />
          <span>Sign In with Google</span>
        </>
      )}
    </button>
  );
}

/**
 * UserSection Component
 * Displays user avatar, name, and menu links when authenticated
 */
interface UserSectionProps {
  user: {
    displayName: string | null;
    photoURL: string | null;
    experiencePoints: number;
  };
  onNavigate?: () => void;
  onOpenCareer?: () => void;
  onOpenLeaderboard?: () => void;
}

function UserSection({ user, onNavigate, onOpenCareer, onOpenLeaderboard }: UserSectionProps) {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* User Info */}
      <div className="flex items-center gap-3 px-2">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-10 h-10 rounded-full border-2 border-accent-red"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent-red/20 border-2 border-accent-red flex items-center justify-center">
            <span className="text-white font-bold">
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {user.displayName || 'Anonymous Driver'}
          </p>
          <p className="text-text-secondary text-xs">
            {user.experiencePoints} XP
          </p>
        </div>
      </div>

      {/* Menu Links */}
      <div className="space-y-1">
        <button
          onClick={onOpenCareer}
          className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-background-tertiary rounded transition-colors"
        >
          My Career
        </button>
        <button
          onClick={onOpenLeaderboard}
          className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-background-tertiary rounded transition-colors"
        >
          Global Leaderboard
        </button>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-background-tertiary rounded transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

// Icon Components
function GalleryIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
