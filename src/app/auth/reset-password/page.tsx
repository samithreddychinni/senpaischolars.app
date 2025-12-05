'use client';

import { BookOpen, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-background grid-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <BookOpen className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              <span className="text-primary">Senpai</span>Scholars
            </span>
          </div>

          <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link href="/auth/forgot-password">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background grid-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <BookOpen className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              <span className="text-primary">Senpai</span>Scholars
            </span>
          </div>

          <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Password Reset Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your password has been updated. Redirecting you to login...
            </p>
            <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background grid-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <BookOpen className="w-10 h-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">
            <span className="text-primary">Senpai</span>Scholars
          </span>
        </div>

        {/* Card */}
        <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create New Password
            </h1>
            <p className="text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor={passwordId}
                className="text-foreground"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border rounded-xl h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={confirmPasswordId}
                className="text-foreground"
              >
                Confirm New Password
              </Label>
              <Input
                id={confirmPasswordId}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-input border-border rounded-xl h-12"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background grid-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
