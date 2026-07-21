import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();

    const hash = Deno.env.get("ADMIN_PASSWORD_HASH");
    const secret = Deno.env.get("JWT_SIGNING_SECRET");

    if (!hash || !secret) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting or backoff logic can be added here if using a store.
    // We MUST use compareSync because Supabase Edge Functions don't support Web Workers (used by async compare).
    const isValid = bcrypt.compareSync(password, hash);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Incorrect password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a JWT that has role = 'admin', expires in 12 hours
    const jwt = await create(
      { alg: "HS256", typ: "JWT" },
      { role: "admin", exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60) },
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
    );

    return new Response(
      JSON.stringify({ token: jwt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Bad request", details: err?.message || err?.toString() }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
