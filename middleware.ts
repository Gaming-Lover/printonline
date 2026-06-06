import { NextResponse, type NextRequest } from "next/server";import { jwtVerify } from "jose";
const secret=new TextEncoder().encode(process.env.NEXTAUTH_SECRET??"development-secret-change-me-32-char");
const protectedPrefixes=["/dashboard","/upload","/checkout","/orders","/admin"];
export async function middleware(req:NextRequest){const {pathname}=req.nextUrl;const res=NextResponse.next();res.headers.set("X-DNS-Prefetch-Control","on");if(!protectedPrefixes.some(p=>pathname.startsWith(p)))return res;const token=req.cookies.get("printhub_session")?.value;if(!token)return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`,req.url));try{const {payload}=await jwtVerify(token,secret);if(pathname.startsWith("/admin")&&payload.role!=="ADMIN")return NextResponse.redirect(new URL("/dashboard",req.url));return res;}catch{return NextResponse.redirect(new URL("/login",req.url));}}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|public).*)"]};
