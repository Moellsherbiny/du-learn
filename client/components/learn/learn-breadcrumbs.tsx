
"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbLabels: Record<string, string> = {
  "/learn": "الرئيسية",
  "/learn/courses": "المقررات",
  "/learn/progress": "التقدم",
  "/learn/achievements": "الإنجازات",
  "/learn/profile": "الملف الشخصي",
  "/learn/settings": "الإعدادات",
};

function formatSegment(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function LearnBreadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const items = segments.map((_, index) => {
    const href =
      "/" + segments.slice(0, index + 1).join("/");

    return {
      href,
      label:
        breadcrumbLabels[href] ??
        formatSegment(segments[index]),
    };
  });

  return (
    <Breadcrumb dir="rtl">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.href}
              className="contents"
            >
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

