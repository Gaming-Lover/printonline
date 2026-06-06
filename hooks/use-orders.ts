"use client";import { useQuery } from "@tanstack/react-query";
export function useOrders(query="",page=1){return useQuery({queryKey:["orders",query,page],queryFn:async()=>{const res=await fetch(`/api/orders?q=${encodeURIComponent(query)}&page=${page}`);if(!res.ok)throw new Error("Failed to load orders");return res.json();}})}
