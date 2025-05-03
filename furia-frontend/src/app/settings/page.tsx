"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next/client";
import Header from "@/components/NavBar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/authService";
import { Footer } from "@/components/Footer";

const tabs = [
  "Dados Pessoais",
  "Upload de Documento",
  "Redes Sociais",
  "Perfis de e-Sports",
];

type ValidationStatus = {
  status: "processing" | "success" | "error";
  message: string;
};

type ValidationStatusMap = {
  [key: string]: ValidationStatus | undefined;
};

type EsportsProfiles = {
  steam: string;
  valorant: string;
  cs2: string;
  gamersclub: string;
  lol: string;
  rainbowSix: string;
};

function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder > 9 ? 0 : remainder;
  if (digit1 !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder > 9 ? 0 : remainder;
  if (digit2 !== parseInt(cpf.charAt(10))) return false;

  return true;
}

const Page = () => {
  const [value, setValue] = useState("0");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    cpf: "",
    interests: "",
    activities: "",
    events: "",
    purchases: "",
    steam: "",
    valorant: "",
    gamersclub: "",
    lol: "",
    cs2: "",
    rainbowSix: "",
  });

  const [esportsProfiles, setEsportsProfiles] = useState<EsportsProfiles>({
    steam: "",
    valorant: "",
    cs2: "",
    gamersclub: "",
    lol: "",
    rainbowSix: "",
  });

  const [document, setDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [validationStatus, setValidationStatus] = useState<ValidationStatusMap>(
    {}
  );
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [hasValidatedDocument, setHasValidatedDocument] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);

  const documentTypes = [
    { value: "rg", label: "RG" },
    { value: "cpf", label: "CPF" },
    { value: "cnh", label: "CNH" },
    { value: "passport", label: "Passaporte" },
  ];

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const token = getCookie("session");
        if (!token) return;

        const docsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/documents`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          setUploadedDocuments(docsData);
          setHasValidatedDocument(docsData.length > 0);
        }
      } catch (error) {
        console.error("Erro ao carregar documentos:", error);
      }
    };

    loadDocuments();
  }, []);

  const isDocumentTypeUploaded = (type: string) => {
    return uploadedDocuments.some((doc) => doc.type === type);
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = getCookie("session");
        if (!token) {
          console.warn("Token não encontrado");
          setLoadingProfile(false);
          return;
        }

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userRes.ok) {
          console.error("Erro ao carregar perfil:", userRes.status);
          setLoadingProfile(false);
          return;
        }

        const userData = await userRes.json();
        console.log("Dados do usuário carregados:", userData);

        const socialRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/social-accounts`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!socialRes.ok) {
          console.error("Erro ao carregar contas sociais:", socialRes.status);
        } else {
          const socialData = await socialRes.json();
          console.log("Contas sociais carregadas:", socialData);
          setLinkedAccounts(socialData);
        }

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          address: userData.address || "",
          cpf: userData.cpf || "",
          interests: userData.interests || "",
          activities: userData.activities || "",
          events: userData.events || "",
          purchases: userData.purchases || "",
          steam: userData.steam || "",
          valorant: userData.valorant || "",
          gamersclub: userData.gamersclub || "",
          lol: userData.lol || "",
          cs2: userData.cs2 || "",
          rainbowSix: userData.rainbowSix || "",
        });

        setEsportsProfiles({
          steam: userData.steam || "",
          valorant: userData.valorant || "",
          cs2: userData.cs2 || "",
          gamersclub: userData.gamersclub || "",
          lol: userData.lol || "",
          rainbowSix: userData.rainbowSix || "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleDocumentValidation = (isValid: boolean, message: string) => {
    if (!isValid) {
      throw new Error(
        message ||
          "Documento inválido. Por favor, verifique se é um documento de identidade válido."
      );
    }
  };

  const handleSave = async () => {
    try {
      const token = getCookie("session");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      let payload: any = {};

      if (value === "0") {
        if (formData.cpf && !isValidCPF(formData.cpf)) {
          toast.error("CPF inválido");
          return;
        }

        payload = {
          address: formData.address,
          cpf: formData.cpf,
          interests: formData.interests,
          activities: formData.activities,
          events: formData.events,
          purchases: formData.purchases,
        };
      } else if (value === "1") {
        if (!documentType) {
          throw new Error("Selecione o tipo de documento.");
        }
        if (!document) {
          throw new Error("Selecione um documento para upload.");
        }

        setIsUploading(true);

        try {
          const formDataUpload = new FormData();
          formDataUpload.append("file", document);
          formDataUpload.append("type", documentType);

          const resUpload = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formDataUpload,
            }
          );

          if (!resUpload.ok) {
            const errorData = await resUpload.json();
            throw new Error(errorData.message || "Erro ao enviar documento.");
          }

          const uploadData = await resUpload.json();

          const docsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/documents`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (docsRes.ok) {
            const docsData = await docsRes.json();
            setUploadedDocuments(docsData);
            setHasValidatedDocument(true);
          }

          setTimeout(() => {
            setDocument(null);
            setDocumentType("");
          }, 3000);

          toast.success("Documento enviado com sucesso!");
        } finally {
          setIsUploading(false);
        }

        return;
      } else if (value === "3") {
        payload = { ...esportsProfiles };
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro: ${res.status} - ${text}`);
      }

      toast.success("Dados atualizados com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar dados");
    }
  };

  const clearValidationStatus = (platform: string) => {
    setValidationStatus((prev) => ({
      ...prev,
      [platform]: undefined,
    }));
  };

  const validateEsportsProfile = async (platform: string, value: string) => {
    try {
      setValidationStatus((prev) => ({
        ...prev,
        [platform]: { status: "processing", message: "Validando..." },
      }));

      const token = getCookie("session");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/esports/validate-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            platform,
            profileUrl: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao validar perfil");
      }

      const data = await response.json();

      setValidationStatus((prev) => ({
        ...prev,
        [platform]: {
          status: data.isValid ? "success" : "error",
          message: data.isValid
            ? "Perfil validado com sucesso!"
            : "Perfil inválido. Por favor, verifique o ID informado.",
        },
      }));

      if (data.isValid && data.profileUrl) {
        setEsportsProfiles((prev) => ({
          ...prev,
          [platform]: data.profileUrl,
        }));
      }
    } catch (error) {
      setValidationStatus((prev) => ({
        ...prev,
        [platform]: {
          status: "error",
          message: "Erro ao validar perfil. Tente novamente.",
        },
      }));
    }
  };

  const getStatusColor = (status: ValidationStatus["status"]): string => {
    switch (status) {
      case "processing":
        return "text-yellow-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "";
    }
  };

  const handleSocialLink = async (provider: string) => {
    try {
      const accessToken = await getAccessToken(provider);

      await authService.linkSocialAccount(provider, accessToken);

      const socialAccounts = await authService.getSocialAccounts();
      setLinkedAccounts(socialAccounts);

      toast.success(`Conta ${provider} vinculada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao vincular ${provider}:`, error);
      toast.error(`Erro ao vincular ${provider}`);
    }
  };

  const handleSocialUnlink = async (provider: string) => {
    try {
      await authService.unlinkSocialAccount(provider);

      const socialAccounts = await authService.getSocialAccounts();
      setLinkedAccounts(socialAccounts);

      toast.success(`Conta ${provider} desvinculada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao desvincular ${provider}:`, error);
      toast.error(`Erro ao desvincular ${provider}`);
    }
  };

  const getAccessToken = async (provider: string): Promise<string> => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const redirectUri = `${process.env.NEXT_PUBLIC_REDI_URL}/auth/callback?provider=${provider}`;

    switch (provider) {
      case "twitch": {
        const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
        const scope = "user:read:email";
        const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=token&scope=${encodeURIComponent(
          scope
        )}&force_verify=true`;

        const popup = window.open(
          authUrl,
          "Vincular Twitch",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        return handlePopupCallback(popup, provider);
      }

      case "discord": {
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        const scope = "identify email";
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=token&scope=${encodeURIComponent(scope)}`;

        const popup = window.open(
          authUrl,
          "Vincular Discord",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        return handlePopupCallback(popup, provider);
      }

      case "twitter": {
        const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
        const scope = "users.read tweet.read";
        const state = generateRandomString();
        const codeVerifier = generateRandomString();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        sessionStorage.setItem("twitter_code_verifier", codeVerifier);

        const authUrl = `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=${encodeURIComponent(
          scope
        )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        const popup = window.open(
          authUrl,
          "Vincular Twitter",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        return handlePopupCallback(popup, provider);
      }

      case "instagram": {
        const provider = "instagram";
        const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID!;
        const redirectUri = `${window.location.origin}/auth/callback?provider=instagram`;
        const scope =
          "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights";
        const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=${encodeURIComponent(scope)}`;

        const width = 500;
        const height = 600;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        const popup = window.open(
          authUrl,
          "Vincular Instagram",
          `width=${width},height=${height},left=${left},top=${top}`
        );

        return handlePopupCallback(popup, provider);
      }

      case "facebook": {
        const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
        const scope = "email";
        const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=token&scope=${encodeURIComponent(scope)}`;

        const popup = window.open(
          authUrl,
          "Vincular Facebook",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        return handlePopupCallback(popup, provider);
      }

      default:
        throw new Error(`Provider ${provider} not implemented`);
    }
  };

  const handlePopupCallback = (
    popup: Window | null,
    provider: string
  ): Promise<string> => {
    if (!popup)
      throw new Error("Não foi possível abrir o popup de autorização");

    return new Promise((resolve, reject) => {
      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          reject(new Error("Popup fechado pelo usuário"));
        }
      }, 1000);

      window.addEventListener("message", function handler(event) {
        if (event.origin !== window.location.origin) return;
        if (
          event.data.type === "social-callback" &&
          event.data.provider === provider
        ) {
          clearInterval(checkPopup);
          window.removeEventListener("message", handler);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.accessToken);
          }
        }
      });
    });
  };

  const generateRandomString = () => {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
      ""
    );
  };

  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const handleUnlinkSocial = async (provider: string) => {
    try {
      const response = await fetch("/api/auth/unlink-social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ provider }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error unlinking social account:", error);
        toast.error("Erro ao desvincular conta social");
        return;
      }

      setLinkedAccounts((prev) =>
        prev.filter(
          (account) => account.provider.toLowerCase() !== provider.toLowerCase()
        )
      );
      toast.success("Conta social desvinculada com sucesso!");
    } catch (error) {
      console.error(`Erro ao desvincular ${provider}:`, error);
      toast.error(`Erro ao desvincular ${provider}`);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "twitch":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
            />
          </svg>
        );
      case "discord":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
            />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        );
      case "facebook":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3V3.5h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const isSocialLinked = (provider: string) => {
    return linkedAccounts.some(
      (account) => account.provider.toLowerCase() === provider.toLowerCase()
    );
  };

  if (loadingProfile) {
    return (
      <main className="p-8 max-w-4xl mx-auto flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Carregando perfil...</p>
      </main>
    );
  }

  return (
    <>
      <main className="p-8 max-w-4xl min-h-screen mx-auto">
        <Header />
        <h1 className="text-3xl font-bold mb-6">Cadastro de Perfil</h1>

        <Tabs
          defaultValue="0"
          value={value}
          onValueChange={setValue}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-10 text-xs md:text-base md:grid-cols-4 md:mb-0">
            {tabs.map((tab, index) => (
              <TabsTrigger
                className="cursor-pointer bg-muted"
                key={index}
                value={index.toString()}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Personal Data */}
          <TabsContent value="0">
            <section className="flex flex-col mt-5 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Nome
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Seu email"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Endereço
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Seu endereço"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    CPF
                  </label>
                  <input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="Seu CPF"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Interesses
                  </label>
                  <input
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="Seus interesses"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Atividades
                  </label>
                  <input
                    name="activities"
                    value={formData.activities}
                    onChange={handleInputChange}
                    placeholder="Suas atividades"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Eventos
                  </label>
                  <input
                    name="events"
                    value={formData.events}
                    onChange={handleInputChange}
                    placeholder="Eventos que participa"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                    Compras
                  </label>
                  <input
                    name="purchases"
                    value={formData.purchases}
                    onChange={handleInputChange}
                    placeholder="Suas compras"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="1">
            <section className="flex flex-col gap-4">
              {/* Upload Document */}
              <div className="mt-4">
                {hasValidatedDocument || uploadedDocuments.length > 0 ? (
                  <div className="p-4 rounded-md bg-green-50 shadow-md dark:shadow-none border-2 border-green-200 dark:border-green-600 text-green-800">
                    <h3 className="text-lg font-medium mb-2">
                      Documento Validado
                    </h3>
                    <p>
                      Você já possui um documento validado em nosso sistema. Não
                      é necessário enviar outro documento.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-2">
                        Tipo de Documento
                      </label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                      >
                        <option value="">Selecione o tipo de documento</option>
                        {documentTypes.map((type) => (
                          <option
                            key={type.value}
                            value={type.value}
                            className="text-black"
                          >
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {documentType && (
                      <>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200">
                          Documento de Identidade
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-zinc-200">
                              <label
                                htmlFor="document-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload de arquivo</span>
                                <input
                                  id="document-upload"
                                  name="document-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-zinc-200">
                              PNG, JPG, PDF até 10MB
                            </p>
                            {document && (
                              <p className="text-sm text-green-600 mt-2">
                                Arquivo selecionado: {document.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Uploaded documents list */}
                {uploadedDocuments.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-200 mb-4">
                      Documentos Enviados
                    </h3>
                    <div className="bg-white dark:bg-card shadow-md border-2 border-zinc-300 dark:border-zinc-700  dark:shadow-none overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {uploadedDocuments.map((doc) => (
                          <li key={doc.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm uppercase font-medium text-gray-900 dark:text-zinc-200 truncate">
                                  {doc.type}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-zinc-200">
                                  Enviado em:{" "}
                                  {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  onClick={async () => {
                                    try {
                                      const token = getCookie("session");
                                      if (!token) return;

                                      const response = await fetch(
                                        `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}`,
                                        {
                                          method: "DELETE",
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                          },
                                        }
                                      );

                                      if (response.ok) {
                                        setUploadedDocuments((prev) =>
                                          prev.filter((d) => d.id !== doc.id)
                                        );
                                        setHasValidatedDocument(false);
                                        toast.success(
                                          "Documento excluído com sucesso!"
                                        );
                                      } else {
                                        const errorData = await response.json();
                                        throw new Error(
                                          errorData.message ||
                                            "Erro ao excluir documento"
                                        );
                                      }
                                    } catch (error) {
                                      console.error(
                                        "Erro ao excluir documento:",
                                        error
                                      );
                                      toast.error(
                                        error instanceof Error
                                          ? error.message
                                          : "Erro ao excluir documento"
                                      );
                                    }
                                  }}
                                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-800"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="2">
            <section className="flex flex-col mt-5 gap-4">
              {/* Link Social Accounts */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white shadow-md border-2 border-zinc-300 dark:border-zinc-700 dark:shadow-none dark:bg-card p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Vincular Contas
                    </h3>
                    <div className="space-y-4">
                      <Button
                        onClick={() => handleSocialLink("facebook")}
                        className={`w-full bg-[#1877F2] text-white hover:bg-[#166FE5] ${
                          isSocialLinked("facebook")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSocialLinked("facebook")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                          />
                        </svg>
                        Vincular com Facebook
                      </Button>
                      <Button
                        onClick={() => handleSocialLink("twitter")}
                        className={`w-full bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] ${
                          isSocialLinked("twitter")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSocialLinked("twitter")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          />
                        </svg>
                        Vincular com Twitter
                      </Button>
                      <Button
                        onClick={() => handleSocialLink("twitch")}
                        className={`w-full bg-[#9146FF] text-white hover:bg-[#7d3ce8] ${
                          isSocialLinked("twitch")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSocialLinked("twitch")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
                          />
                        </svg>
                        Vincular com Twitch
                      </Button>
                      <Button
                        onClick={() => handleSocialLink("discord")}
                        className={`w-full bg-[#5865F2] text-white hover:bg-[#4752c4] ${
                          isSocialLinked("discord")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSocialLinked("discord")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                          />
                        </svg>
                        Vincular com Discord
                      </Button>
                      <Button
                        onClick={() => handleSocialLink("instagram")}
                        className={`w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white hover:opacity-90 ${
                          isSocialLinked("instagram")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSocialLinked("instagram")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                          />
                        </svg>
                        Vincular com Instagram
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white shadow-md border-2 border-zinc-300 dark:border-zinc-700 dark:shadow-none dark:bg-card p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Contas Vinculadas
                    </h3>
                    <div className="space-y-4">
                      {linkedAccounts.length === 0 ? (
                        <p className="text-gray-500">
                          Nenhuma conta vinculada ainda.
                        </p>
                      ) : (
                        linkedAccounts.map((account, index) => (
                          <div
                            key={account.id || index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-600 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-600 dark:text-zinc-200">
                                {getProviderIcon(account.provider)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-zinc-200">
                                  {account.provider.charAt(0).toUpperCase() +
                                    account.provider.slice(1)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {account.email}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleSocialUnlink(account.provider)
                              }
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                            >
                              Desvincular
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="3">
            <section className="flex flex-col mt-5 gap-4">
              {/* eSports Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(esportsProfiles).map(([platform, value]) => {
                  const currentStatus = validationStatus[platform];
                  return (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
                        {platform === "lol"
                          ? "League of Legends"
                          : platform.charAt(0).toUpperCase() +
                            platform.slice(1)}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => {
                            setEsportsProfiles((prev) => ({
                              ...prev,
                              [platform]: e.target.value,
                            }));
                            clearValidationStatus(platform);
                          }}
                          placeholder={`Seu ID no ${platform}`}
                          className="border rounded px-3 py-2 w-full"
                        />
                        <button
                          onClick={() => {
                            const trimmedValue = value.trim();
                            if (trimmedValue) {
                              validateEsportsProfile(platform, trimmedValue);
                            }
                          }}
                          className="px-3 py-2 cursor-pointer rounded-md bg-green-600 text-white hover:bg-green-700"
                        >
                          Validar
                        </button>
                      </div>
                      {currentStatus && (
                        <p
                          className={`mt-1 text-sm ${getStatusColor(
                            currentStatus.status
                          )}`}
                        >
                          {currentStatus.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {(value === "0" ||
          (value !== "3" &&
            !(
              (value === "1" && hasValidatedDocument) ||
              uploadedDocuments.length > 0
            ))) && (
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className={`w-full mt-8 bg-green-600 text-white hover:bg-green-700 ${
              isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Enviando..." : "Salvar Seção"}
          </Button>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Page;
