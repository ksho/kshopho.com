"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { SocialLinks } from "@/components/SocialLinks";

export function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Close the menus whenever the route changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setNavOpen(false);
    setOpenSubmenu(null);
  }

  // The mobile menu hides the page content behind it via a body class.
  useEffect(() => {
    document.body.classList.toggle("nav-open", navOpen);
    return () => document.body.classList.remove("nav-open");
  }, [navOpen]);

  // On small screens the sticky header slides away while scrolling down
  // (after the first 250px) and comes back as soon as you scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 250) {
        document.body.classList.add("is-scrolling-down");
      } else {
        document.body.classList.remove("is-scrolling-down");
      }
      lastY = y <= 0 ? 0 : y;
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      document.body.classList.remove("is-scrolling-down");
    };
  }, []);

  const isSelected = (href?: string) => href !== undefined && pathname === href;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <Link className="brand__link" href="/">
            <h1 className="brand__title">{site.title}</h1>
            <h2 className="brand__subtitle">{site.subtitle}</h2>
          </Link>
        </div>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={navOpen}
          aria-controls="site-nav"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          onClick={() => setNavOpen((open) => !open)}
        >
          <MenuIcon className="nav__toggle-icon nav__toggle-icon--open" />
          <CloseIcon className="nav__toggle-icon nav__toggle-icon--close" />
        </button>

        <nav className="nav" id="site-nav" aria-label="Main">
          <ul className="nav__list">
            {nav.map((item) => {
              if (item.children) {
                const open = openSubmenu === item.label;
                const childSelected = item.children.some((c) => isSelected(c.href));
                return (
                  <li
                    key={item.label}
                    className={`nav__item nav__item--parent${open ? " is-open" : ""}${
                      childSelected ? " nav__item--selected" : ""
                    }`}
                    onMouseLeave={() => setOpenSubmenu(null)}
                  >
                    <button
                      type="button"
                      className="nav__link"
                      aria-haspopup="true"
                      aria-expanded={open}
                      onClick={() => setOpenSubmenu(open ? null : item.label)}
                    >
                      {item.label}
                    </button>
                    <div className="nav__submenu">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          className={`nav__sublink${isSelected(child.href) ? " nav__sublink--selected" : ""}`}
                          href={child.href}
                          aria-current={isSelected(child.href) ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              }
              const selected = isSelected(item.href);
              return (
                <li key={item.label} className={`nav__item${selected ? " nav__item--selected" : ""}`}>
                  <Link
                    className="nav__link"
                    href={item.href ?? "/"}
                    aria-current={selected ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <SocialLinks />
        </nav>
      </div>
    </header>
  );
}
