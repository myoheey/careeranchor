import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-1">
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          Entre<span className="text-blue-600">LMS</span>
        </span>
      </Link>

      <div className="w-full max-w-sm">
        {children}
      </div>

      <p className="mt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} EntreLMS
      </p>
    </div>
  );
}
