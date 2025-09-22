import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          EasyStay Retreats
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          Effortless vacation rental search designed for modern travelers.
        </h1>
        <p className="text-lg text-slate-600">
          Head over to the search experience to preview the interactive property map
          and filtering system we&apos;re building for the new Webflow Cloud app.
        </p>
        <div>
          <Link
            href="/search-properties"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-medium text-white transition hover:bg-slate-700"
          >
            Explore the search experience
          </Link>
        </div>
      </div>
    </main>
  );
}
