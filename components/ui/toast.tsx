"use client";import * as ToastPrimitive from "@radix-ui/react-toast";import { cn } from "@/lib/utils";
export const ToastProvider=ToastPrimitive.Provider;export const ToastViewport=({className,...p}:React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>)=><ToastPrimitive.Viewport className={cn("fixed bottom-0 right-0 z-50 m-4 flex max-w-sm flex-col gap-2",className)} {...p}/>;
export function Toast({className,...p}:React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>){return <ToastPrimitive.Root className={cn("rounded-md border bg-background p-4 shadow",className)} {...p}/>}
export const ToastTitle=ToastPrimitive.Title;export const ToastDescription=ToastPrimitive.Description;export const ToastClose=ToastPrimitive.Close;
