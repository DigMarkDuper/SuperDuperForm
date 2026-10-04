import RegistrationForm from '@/components/RegistrationForm';

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Soft ambient background shapes */}
      <div aria-hidden="true" className="fixed top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div aria-hidden="true" className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-brand-blue-soft/60 rounded-full blur-3xl translate-x-1/4 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <RegistrationForm />
      </div>
    </main>
  );
}
