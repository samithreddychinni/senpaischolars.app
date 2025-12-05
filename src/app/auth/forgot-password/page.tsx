'use client';

import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: '/auth/reset-password',
      });
      setSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Check Your Email
            </h1>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent a password reset link to{' '}
              <span className="text-foreground font-medium">{email}</span>
            </p>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
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
        {/* Back link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>

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
              Forgot Password?
            </h1>
            <p className="text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor={emailId}
                className="text-foreground"
              >
                Email
              </Label>
              <Input
                id={emailId}
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
