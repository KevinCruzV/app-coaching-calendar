import Logout from "@/components/form/logout";
import { getSession } from "@/lib/auth/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSession();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-default bg-black px-5 py-2">
            <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                    src="https://flowbite.com/docs/images/logo.svg"
                    alt="CoachCal Logo"
                    width={32}
                    height={32}
                    className="mr-1"
                    />
                    <span className="text-xl font-semibold text-heading">CoachCal</span>
                </Link>

                <nav>
                    <ul className="flex items-center gap-6">
                    <li>
                        <Link href="/coach/availabilities" className="text-heading hover:text-fg-brand">
                        Availabilities
                        </Link>
                    </li>
                    <li>
                        <Link href="/coach/appointments" className="text-heading hover:text-fg-brand">
                        Appointments
                        </Link>
                    </li>
                    <li>
                        <Link href="/coach/profile" className="text-heading hover:text-fg-brand">
                        Profile
                        </Link>
                    </li>
                    <li>
                        <Logout />
                    </li>
                    </ul>
                </nav>
            </div>
        </header>

        <main className="pt-20 flex-1 bg-white">
            <div className="mx-auto w-full px-0 py-1 h-full">
                {children}
            </div>
        </main>
        {/* TODO FOOTER */}
    </div> 
      
  );
}
