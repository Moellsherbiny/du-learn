import { VerifyEmailForm } from "@/components/auth/verify-email-form";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;

  const email =
    typeof params.email === "string"
      ? params.email.trim()
      : "";

  return (
    <main
      dir="rtl"
      className="relative flex min-h-[calc(100svh-1px)] items-center justify-center overflow-hidden px-6 py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle,rgba(100,100,100,0.18)_1px,transparent_1px)] bg-size-[22px_22px]"
      />

      <div className="relative z-10 w-full max-w-md">
        <VerifyEmailForm email={email} />
      </div>
    </main>
  );
}