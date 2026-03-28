import AppShell from '@/components/layout/AppShell';
import { AuthProvider } from '@/context/AuthContext';

export default function DashboardLayout({ children }) {
    return (
        <AuthProvider>
            <AppShell>{children}</AppShell>
        </AuthProvider>
    );
}
