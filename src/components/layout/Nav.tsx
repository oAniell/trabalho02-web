"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiFileText, FiPlusCircle, FiHome } from "react-icons/fi";

const links = [
  { href: "/", label: "Início", icon: FiHome },
  { href: "/curriculos/visualizar", label: "Currículos", icon: FiFileText },
  { href: "/curriculos/cadastrar", label: "Cadastrar", icon: FiPlusCircle },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
