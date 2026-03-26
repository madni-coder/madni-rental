import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0">{children}</main>
    </div>
  );
}
