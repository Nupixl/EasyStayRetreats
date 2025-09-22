import Image from "next/image";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[var(--layout-max-width)] items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900"
            aria-label="Open navigation"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <Link href="https://easystayretreats.homes" className="flex items-center gap-2">
            <Image
              src="/images/logo.avif"
              alt="EasyStay Retreats"
              width={128}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link href="https://easystayretreats.homes/where" className="transition hover:text-slate-900">
            Where
          </Link>
          <Link href="https://easystayretreats.homes/when" className="transition hover:text-slate-900">
            When
          </Link>
          <Link href="https://easystayretreats.homes/who" className="transition hover:text-slate-900">
            Who
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="https://easystayretreats.homes/property-owners"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            Become a host
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            E
          </div>
        </div>
      </div>
    </header>
  );
}
