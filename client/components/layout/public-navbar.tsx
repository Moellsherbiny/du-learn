import { getMeAction } from "@/actions/auth/me";

import { Brand } from "./brand";
import { NavbarLinks } from "./navbar-links";
import { NavbarActions } from "./navbar-actions";
import { MobileNavbar } from "./mobile-navbar";

export async function PublicNavbar() {
  const { authenticated } = await getMeAction();

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-border/60
        bg-background/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto flex h-16 w-full max-w-7xl
          items-center justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        <Brand />

        <NavbarLinks />

        <NavbarActions authenticated={authenticated} />

        <MobileNavbar authenticated={authenticated} />
      </div>
    </header>
  );
}