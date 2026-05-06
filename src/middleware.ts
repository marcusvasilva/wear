import { auth } from "@/lib/auth";

const protectedRoutes = ["/pedido", "/meus-pedidos"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    if (!req.auth) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return Response.redirect(loginUrl);
    }
    if (!req.auth.user?.isAdmin) {
      return Response.redirect(new URL("/", req.nextUrl.origin));
    }
    return;
  }

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
  matcher: ["/pedido/:path*", "/meus-pedidos/:path*", "/admin/:path*"],
};
