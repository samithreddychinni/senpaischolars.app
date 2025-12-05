'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/auth-client';

export default function SignUpPage() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || 'Sign up failed');
        return;
      }

      router.push('/auth/sign-up-success');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Start your learning journey today
            </p>
          </div>

          <form
            onSubmit={handleSignUp}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor={nameId}
                className="text-foreground"
              >
                Full Name
              </Label>
              <Input
                id={nameId}
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border rounded-xl h-12"
              />
            </div>

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

            <div className="space-y-2">
              <Label
                htmlFor={passwordId}
                className="text-foreground"
              >
                Password
              </Label>
              <Input
                id={passwordId}
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={confirmPasswordId}
                className="text-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id={confirmPasswordId}
                type="password"
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <Link
            href="/terms"
            className="text-primary hover:underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
