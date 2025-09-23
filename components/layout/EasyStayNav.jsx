import { Fragment, useState } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Logo from "../../public/_svgs/Logo";

const travelerLinks = [
  { label: "Travel Services", href: "/travel/services" },
  { label: "About EasyStay", href: "/travel/about" },
  { label: "Explore Retreats", href: "/s/_" },
];

const ownerLinks = [
  { label: "Owner Solutions", href: "/owners/solutions" },
  { label: "Revenue Forecast", href: "/owners/revenue" },
  { label: "Schedule a Call", href: "/owners/contact" },
];

const NavDropdown = ({ label, items }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex items-center gap-2 rounded-full border border-lightBorderColor bg-white px-4 py-2 text-sm font-medium text-blackColor shadow-sm transition hover:border-primaryColor hover:text-primaryColor">
        <span>{label}</span>
        <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-3 w-56 origin-top-left rounded-2xl border border-lightBorderColor bg-white p-2 shadow-xl focus:outline-none">
          {items.map((item) => (
            <Menu.Item key={item.label}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                    active ? "bg-surfaceMuted text-primaryColor" : "text-blackColor"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const MobileMenu = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="absolute inset-x-0 top-full z-40 origin-top rounded-b-3xl border-b border-lightBorderColor bg-white px-4 pb-6 pt-4 shadow-lg">
      <div className="space-y-4 text-sm font-medium text-blackColor">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-lightTextColor">
            Travelers
          </p>
          <div className="space-y-1">
            {travelerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="block rounded-xl border border-transparent px-3 py-2 transition hover:border-primaryColor hover:text-primaryColor"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-lightTextColor">
            Owners
          </p>
          <div className="space-y-1">
            {ownerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="block rounded-xl border border-transparent px-3 py-2 transition hover:border-primaryColor hover:text-primaryColor"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/login"
          onClick={onClose}
          className="inline-flex w-full items-center justify-center rounded-full border border-primaryColor bg-primaryColor px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryColor/90"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

const EasyStayNav = ({ className = "" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-lightBorderColor bg-white/85 backdrop-blur ${className}`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="sr-only">EasyStay Retreats</span>
          <Logo />
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <NavDropdown label="Travelers" items={travelerLinks} />
          <NavDropdown label="Owners" items={ownerLinks} />
        </div>

        <div className="hidden md:flex">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-primaryColor bg-white px-5 py-2 text-sm font-semibold text-primaryColor shadow-sm transition hover:bg-primaryColor hover:text-white"
          >
            Log in
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-lightBorderColor bg-white p-2 text-blackColor shadow-sm transition hover:border-primaryColor md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          {mobileOpen ? (
            <XIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};

export default EasyStayNav;
