import { auth } from "@/lib/auth";

const protectedRoutes = ["/checkout", "/pedido", "/meus-pedidos"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/checkout/:path*", "/pedido/:path*", "/meus-pedidos/:path*"],
};
