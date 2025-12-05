'use client';

import { BookOpen, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              <span className="text-primary">Senpai</span>Scholars
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              Courses
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#pricing"
              className="text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isPending ? (
              <div className="w-20 h-9 bg-muted rounded-lg animate-pulse" />
            ) : session?.user ? (
              <>
                <span className="text-foreground text-sm">
                  {session.user.name || session.user.email}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-foreground hover:text-primary"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-foreground hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    type="button"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a
                href="#courses"
                className="text-foreground hover:text-primary transition-colors"
              >
                Courses
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-primary transition-colors"
              >
                About
              </a>
              <a
                href="#pricing"
                className="text-foreground hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {isPending ? (
                  <div className="w-full h-9 bg-muted rounded-lg animate-pulse" />
                ) : session?.user ? (
                  <>
                    <span className="text-foreground text-sm px-4">
                      {session.user.name || session.user.email}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-foreground hover:text-primary justify-start"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-foreground hover:text-primary justify-start w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground justify-start w-full"
                        type="button"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
