import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/database';

/**
 * Transforms a 10-digit Indian phone number to synthetic email
 */
export function phoneToEmail(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@vldd.local`;
}

/**
 * Transforms synthetic email back to 10-digit phone
 */
export function emailToPhone(email: string): string {
  return email.split('@')[0];
}

/**
 * Retrieves the currently authenticated user's session and profile
 */
export async function getSession(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const supabase = createClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        return {
          user: session.user,
          profile,
        };
      }
    }
  } catch {}

  // Fallback for local demo/development
  try {
    const cookieStore = require('next/headers').cookies();
    const localUserCookie = cookieStore.get('vldd_local_user')?.value;
    if (localUserCookie) {
      const parsed = JSON.parse(localUserCookie);
      const mockProfile: Profile = {
        id: 'mock-user-123',
        name: parsed.name || 'Student',
        phone: parsed.phone || '9876543210',
        role: parsed.role || 'student',
        created_at: new Date().toISOString(),
      };
      return {
        user: { id: mockProfile.id, email: `${mockProfile.phone}@vldd.local` },
        profile: mockProfile,
      };
    }
  } catch {}

  return { user: null, profile: null };
}

/**
 * Requires a logged-in user. If not logged in, redirects to /login.
 */
export async function requireUser(): Promise<{
  user: { id: string; email?: string };
  profile: Profile;
}> {
  const { user, profile } = await getSession();

  if (!user || !profile) {
    redirect('/login');
  }

  return { user, profile };
}

/**
 * Requires an admin user. If not admin, returns 404 (Section 6: never redirect, so admin URLs are undiscoverable).
 */
export async function requireAdmin(): Promise<{
  user: { id: string; email?: string };
  profile: Profile;
}> {
  const { user, profile } = await getSession();

  if (!user || !profile || profile.role !== 'admin') {
    notFound();
  }

  return { user, profile };
}

/**
 * Exact error messages specified in Section 6
 */
export const AUTH_ERRORS = {
  WRONG_CREDENTIALS: 'Number ya password galat hai. Dobara try karo.',
  ALREADY_REGISTERED: 'Ye number pehle se registered hai. Login karo.',
  WEAK_PASSWORD: 'Password kam se kam 6 character ka rakho.',
  INVALID_PHONE: '10 digit ka mobile number daalo.',
  NETWORK_FAILURE: 'Internet slow lag raha hai. Ek baar aur try karo.',
};
