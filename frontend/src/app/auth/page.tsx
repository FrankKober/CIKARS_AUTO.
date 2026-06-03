import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 pattern-grid">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <AuthForm />
      </div>
    </main>
  );
}