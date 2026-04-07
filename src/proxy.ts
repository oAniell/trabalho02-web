import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas antigas (sistema/paginas/*) redirecionam para as rotas amigáveis
const redirects: Record<string, string> = {
  "/sistema/paginas/curriculos": "/curriculos/visualizar",
  "/sistema/paginas/novo": "/curriculos/cadastrar",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redireciona rotas legadas
  for (const [from, to] of Object.entries(redirects)) {
    if (pathname === from || pathname.startsWith(from + "/")) {
      const newPath = pathname.replace(from, to);
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sistema/:path*"],
};
