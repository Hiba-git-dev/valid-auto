'use client';
import { AuthProvider } from './context/AuthContext';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BackToTop from './components/BackToTop';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <FloatingWhatsApp />
      <BackToTop />
    </AuthProvider>
  );
}
