"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get("provider");
      const hash = window.location.hash;
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        window.opener?.postMessage({ type: "social-callback", provider, error }, window.location.origin);
        window.close();
        return;
      }

      let accessToken;

      if (hash?.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        accessToken = params.get("access_token");
      } else if (code) {
        try {
          const codeVerifier =
            provider === "twitter" ? sessionStorage.getItem("twitter_code_verifier") : undefined;

          const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth/${provider}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              code_verifier: codeVerifier,
              redirect_uri: `${window.location.origin}/auth/callback?provider=${provider}`,
            }),
          });

          if (!tokenResponse.ok) throw new Error("Failed to get access token");

          const data = await tokenResponse.json();
          accessToken = data.access_token;
        } catch (err) {
          console.error("Error getting token:", err);
          window.opener?.postMessage({ type: "social-callback", provider, error: "Failed to get token" }, window.location.origin);
          window.close();
          return;
        }
      }

      if (!accessToken) {
        window.opener?.postMessage({ type: "social-callback", provider, error: "No access token" }, window.location.origin);
        window.close();
        return;
      }

      window.opener?.postMessage({ type: "social-callback", provider, accessToken }, window.location.origin);
      window.close();
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center">Processando autenticação...</p>
    </div>
  );
}
