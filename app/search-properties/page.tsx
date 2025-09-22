import { SiteHeader } from "@/components/layout/site-header";
import { SearchShell } from "@/components/search/search-shell";

export default function SearchPropertiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[var(--layout-max-width)] flex-1 px-4 pb-8 pt-6 sm:px-8">
        <SearchShell />
      </main>
    </div>
  );
}
