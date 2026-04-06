import { Bell, LogOut } from "lucide-react";
import { signOut } from "@/auth";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
};

export default function AppHeader({
  title,
  subtitle,
  userName,
  userEmail,
  userRole,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">
              {userRole} · {userEmail}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {userName?.charAt(0) ?? "U"}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}