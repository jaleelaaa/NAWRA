import { ReactNode } from 'react';
import PatronLayout from '@/components/PatronLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <PatronLayout>{children}</PatronLayout>;
}
