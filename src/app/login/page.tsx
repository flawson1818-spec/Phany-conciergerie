import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { login } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-full items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-2xl font-bold text-neutral-950">
            P
          </span>
          <h1 className="text-xl font-semibold text-neutral-900">PHANY</h1>
          <p className="text-sm text-neutral-500">Conciergerie · Lomé</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Connexion</h2>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Email ou mot de passe incorrect.
            </p>
          )}
          <form action={login} className="space-y-4">
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Email</span>
              <input type="email" name="email" required autoFocus className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Mot de passe</span>
              <input type="password" name="password" required className={inputClass} />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
