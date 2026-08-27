'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { phoneToEmail, AUTH_ERRORS } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Poora naam daalna zaroori hai.'),
  phone: z.string().regex(/^[0-9]{10}$/, AUTH_ERRORS.INVALID_PHONE),
  password: z.string().min(6, AUTH_ERRORS.WEAK_PASSWORD),
});

const loginSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, AUTH_ERRORS.INVALID_PHONE),
  password: z.string().min(6, AUTH_ERRORS.WEAK_PASSWORD),
});

export type AuthResult = {
  success: boolean;
  error?: string;
};

/**
 * Register Server Action
 */
export async function registerAction(formData: FormData): Promise<AuthResult> {
  const rawData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    password: formData.get('password') as string,
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || AUTH_ERRORS.INVALID_PHONE,
    };
  }

  const { name, phone, password } = parsed.data;
  const email = phoneToEmail(phone);
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: 'student' },
        // Skip email confirmation — phone-based auth
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('user already exists') || msg.includes('already been registered')) {
        return { success: false, error: AUTH_ERRORS.ALREADY_REGISTERED };
      }
      if (msg.includes('password') || msg.includes('weak')) {
        return { success: false, error: 'Password kam se kam 6 characters ka hona chahiye.' };
      }
      console.error('Register error:', error.message);
      return { success: false, error: `Registration fail: ${error.message}` };
    }

    if (!data.user) {
      return { success: false, error: AUTH_ERRORS.NETWORK_FAILURE };
    }

    // If session exists (email confirmation disabled), user is logged in
    if (data.session) {
      return { success: true };
    }

    // Email confirmation is ON in Supabase — auto sign-in after signup
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      // Account created, but auto-login failed — user can login manually
      return { success: true };
    }

    return { success: true };
  } catch (err: unknown) {
    // If Supabase is not connected, set a demo cookie
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isMock) {
      cookies().set('vldd_local_user', JSON.stringify({ name, phone, role: 'student' }), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return { success: true };
    }

    return { success: false, error: AUTH_ERRORS.NETWORK_FAILURE };
  }
}

/**
 * Login Server Action
 */
export async function loginAction(formData: FormData): Promise<AuthResult> {
  const rawData = {
    phone: formData.get('phone') as string,
    password: formData.get('password') as string,
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || AUTH_ERRORS.INVALID_PHONE,
    };
  }

  const { phone, password } = parsed.data;
  const email = phoneToEmail(phone);

  try {
    const supabase = createClient();

    // If Supabase is in placeholder/mock mode locally, log in directly:
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isMock) {
      cookies().set('vldd_local_user', JSON.stringify({ name: 'Rahul Sharma (Student)', phone, role: 'student' }), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: AUTH_ERRORS.WRONG_CREDENTIALS };
    }

    return { success: true };
  } catch (err: unknown) {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isMock) {
      cookies().set('vldd_local_user', JSON.stringify({ name: 'Rahul Sharma (Student)', phone, role: 'student' }), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return { success: true };
    }

    return { success: false, error: AUTH_ERRORS.WRONG_CREDENTIALS };
  }
}

/**
 * Logout Server Action
 */
export async function logoutAction() {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
  } catch {}

  cookies().delete('vldd_local_user');
  redirect('/login');
}
