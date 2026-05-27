"use client";

import { usePathname } from "next/navigation";
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { ThemeColorSwitcher } from "~/components/theme-color-switcher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import React from "react";

function getBreadcrumbs(pathname: string) {
  if (!pathname || pathname === "/") return [];
  const segments = pathname.split("/").filter(Boolean);
  
  return segments.map((segment, index) => {
    const url = `/${segments.slice(0, index + 1).join("/")}`;
    // capitalize the segment and handle hyphens
    const label = segment.replace(/-/g, ' ');
    const title = label.charAt(0).toUpperCase() + label.slice(1);
    
    return {
      title,
      url,
      isLast: index === segments.length - 1
    };
  });
}

export function SiteHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.url}>
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.url}>{crumb.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!crumb.isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeColorSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
