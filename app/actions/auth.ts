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
        data: {
          name,
          phone,
          role: 'student',
        },
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('user already exists')
      ) {
        return { success: false, error: AUTH_ERRORS.ALREADY_REGISTERED };
      }
      return { success: false, error: AUTH_ERRORS.WRONG_CREDENTIALS };
    }

    if (!data.user) {
      return { success: false, error: AUTH_ERRORS.NETWORK_FAILURE };
    }

    return { success: true };
  } catch (err: unknown) {
    // If Supabase is not connected (e.g. initial local preview without env vars),
    // set a demo cookie so local preview works seamlessly.
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
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: AUTH_ERRORS.WRONG_CREDENTIALS };
    }

    return { success: true };
  } catch (err: unknown) {
    // If Supabase is in demo/placeholder mode locally:
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isMock) {
      cookies().set('vldd_local_user', JSON.stringify({ name: 'Student', phone, role: 'student' }), {
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
