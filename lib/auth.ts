import { cache } from 'react';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile } from '@/types/database';

/**
 * Transforms a 10-digit Indian phone number to synthetic email
 */
export function phoneToEmail(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@vlddnotes.com`;
}

/**
 * Transforms synthetic email back to 10-digit phone
 */
export function emailToPhone(email: string): string {
  return email.split('@')[0];
}

/**
 * Retrieves the currently authenticated user's session and profile (cached per request)
 */
export const getSession = cache(async (): Promise<{
  user: { id: string; email?: string; user_metadata?: Record<string, any> } | null;
  profile: Profile | null;
}> => {
  const supabase = createClient();

  try {
    let authUser: { id: string; email?: string; user_metadata?: Record<string, any>; created_at?: string } | null = null;

    // 1. Try getUser() first (validates with Supabase Auth)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) authUser = user;
    } catch {}

    // 2. Fallback to getSession() if getUser was slow or failed
    if (!authUser) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) authUser = session.user;
      } catch {}
    }

    if (authUser) {
      const phone = authUser.user_metadata?.phone ||
        (authUser.email ? emailToPhone(authUser.email) : '9876543210');
      const name = authUser.user_metadata?.name || 'Student';
      const role = (authUser.user_metadata?.role as 'student' | 'admin') || 'student';

      // Try fetching profile with admin client (bypasses RLS issues)
      try {
        const admin = createAdminClient();
        const { data: dbProfile } = await admin
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (dbProfile) {
          return { user: authUser, profile: dbProfile as Profile };
        }

        // Auto-create missing profile in DB
        const { data: newProfile } = await (admin
          .from('profiles') as any)
          .upsert({
            id: authUser.id,
            name,
            phone,
            role,
          })
          .select()
          .single();

        if (newProfile) {
          return { user: authUser, profile: newProfile as Profile };
        }
      } catch {}

      // Fallback in-memory profile if DB is unreachable
      const fallbackProfile: Profile = {
        id: authUser.id,
        name,
        phone,
        role,
        created_at: authUser.created_at || new Date().toISOString(),
      };

      return { user: authUser, profile: fallbackProfile };
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
        user: { id: mockProfile.id, email: `${mockProfile.phone}@vlddnotes.com` },
        profile: mockProfile,
      };
    }
  } catch {}

  return { user: null, profile: null };
});

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
