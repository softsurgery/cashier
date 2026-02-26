import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { filter } from "rxjs/operators";

const SIDEBAR_KEY = "layout.sidebar.visible";
const THEME_KEY = "layout.theme";

export type AppTheme = "light" | "dark" | "system";

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  isSidebarVisible = new BehaviorSubject<boolean>(
    this.getBoolean(SIDEBAR_KEY, true),
  );

  theme = new BehaviorSubject<AppTheme>(this.getTheme());

  breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.applyTheme(this.theme.value);

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (this.theme.value === "system") {
          this.applyTheme("system");
        }
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initial check
    setTimeout(() => this.updateBreadcrumbs(), 0);
  }

  private updateBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    this.addBreadcrumbs(this.router.routerState.snapshot.root, "", breadcrumbs);
    this.breadcrumbs.next(breadcrumbs);
  }

  private addBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string,
    breadcrumbs: Breadcrumb[],
  ): void {
    for (const child of route.children) {
      // Get URL segments from url array or from routeConfig.path for component-less routes
      let segments = child.url.map((s) => s.path).join("/");
      if (!segments && child.routeConfig?.path) {
        segments = child.routeConfig.path;
      }
      const currentUrl = segments ? `${url}/${segments}` : url;

      const breadcrumb =
        child.data["breadcrumb"] || child.routeConfig?.data?.["breadcrumb"];

      if (breadcrumb && !breadcrumbs.find((b) => b.label === breadcrumb)) {
        breadcrumbs.push({
          label: breadcrumb,
          url: currentUrl || "/",
        });
      }

      this.addBreadcrumbs(child, currentUrl, breadcrumbs);
    }
  }

  toggleSidebar(): void {
    const value = !this.isSidebarVisible.value;
    this.isSidebarVisible.next(value);
    localStorage.setItem(SIDEBAR_KEY, String(value));
  }

  setTheme(theme: AppTheme): void {
    this.theme.next(theme);
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    const html = document.documentElement;
    let effectiveTheme = theme;
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    const enabled = effectiveTheme === "dark";
    html.classList.toggle("dark", enabled);
    html.setAttribute("data-theme", effectiveTheme);
  }

  private getBoolean(key: string, fallback: boolean): boolean {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  }

  private getTheme(): AppTheme {
    const value = localStorage.getItem(THEME_KEY) as AppTheme;
    return value || "system";
  }
}
