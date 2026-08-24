import { Metadata } from 'next';
import { AuthForm } from '../auth-form';

export const metadata: Metadata = {
  title: 'Register — VLDD Notes Hub',
  description: 'Naya account banayein — sirf naam aur mobile number se.',
};

export default function RegisterPage() {
  return <AuthForm initialMode="register" />;
}
