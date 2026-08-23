import Link from "next/link";
import { Linkedin, Youtube, Instagram } from "lucide-react";

const footerSections = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse Models", href: "/models" },
      { label: "Free Models", href: "/models?q=free" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Shopping Cart", href: "/cart" },
      { label: "My Orders", href: "/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 glass">
      <div className="mx-auto max-w-site px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              <span className="text-brand">ocean</span>
              <span className="text-white">trade</span>
            </Link>
            <p className="mt-4 text-sm text-white/40">
              3D model marketplace with image search and shopping cart.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Ocean Trade. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="LinkedIn" className="text-white/30 hover:text-brand">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="text-white/30 hover:text-brand">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/30 hover:text-brand">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
