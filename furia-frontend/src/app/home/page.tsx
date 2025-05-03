"use client";

import { UserProfileCard } from "../../components/UserProfileCard";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LogoSection from "@/components/Partners";
import Header from "@/components/NavBar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TermsOfServiceModal } from "@/components/TermsOfServiceModal";
import { Footer } from "@/components/Footer";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("session");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-900">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <TermsOfServiceModal />
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-zinc-200 mb-2">
                Furia Know Your Fan
              </h2>
              <p className="text-lg font-medium text-gray-800 dark:text-zinc-200 mb-5">
                Mostre que você é FURIA de verdade. Complete seu perfil, conecte
                suas redes e desbloqueie conteúdos exclusivos, recompensas e
                experiências que só os fãs mais leais têm acesso. Aqui, cada
                interação aproxima você ainda mais dos seus ídolos e da
                comunidade FURIOSA.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/settings")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-lg whitespace-normal max-w-[90%] md:max-w-none mx-auto font-bold"
              >
                Complete seu perfil e desbloqueie vantagens exclusivas como fã!
              </Button>
            </div>
            <UserProfileCard />
          </div>
        </div>

        <LogoSection />
      </div>
      <Footer />
    </main>
  );
}
