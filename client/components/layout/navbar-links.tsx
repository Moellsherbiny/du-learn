import Link from "next/link";
import {
  GraduationCap,
  Home,
  Info,
} from "lucide-react";

export const navigation = [
  {
    label: "الرئيسية",
    href: "/",
    icon: Home,
  },
  {
    label: "الدورات التعليمية",
    href: "/courses",
    icon: GraduationCap,
  },
  {
    label: "عن المشروع",
    href: "/about",
    icon: Info,
  },
];

export function NavbarLinks() {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="hidden items-center gap-1 md:flex"
    >
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              group inline-flex h-9 items-center gap-2
              rounded-lg px-3.5
              text-sm font-medium
              text-muted-foreground
              transition-colors
              hover:bg-muted/70
              hover:text-foreground
            "
          >
            <Icon
              className="
                size-3.5 opacity-70
                transition-opacity
                group-hover:opacity-100
              "
            />

            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}