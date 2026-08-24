import { Metadata } from 'next';
import { AuthForm } from '../auth-form';

export const metadata: Metadata = {
  title: 'Login — VLDD Notes Hub',
  description: 'Apne mobile number aur password se login karein.',
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
