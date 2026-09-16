"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "/learn": "الرئيسية",
  "/learn/courses": "المقررات",
  "/learn/progress": "التقدم",
  "/learn/achievements": "الإنجازات",
};

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
        segments[index],
    };
  });

  return (
    <Breadcrumb>
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