import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getCookie } from "cookies-next";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function TermsOfServiceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      const token = getCookie("session");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/terms");
        if (!response.data.hasAcceptedTerms) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error checking terms acceptance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTermsAcceptance();
  }, []);

  const handleAccept = async () => {
    try {
      await api.post("/users/terms", { accepted: true });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error accepting terms:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-zinc-900 flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-zinc-200">
              Termos de Serviço
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-zinc-400">
              Por favor, leia e aceite nossos termos de serviço para continuar.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto p-4 text-gray-700 dark:text-zinc-300">
            <h3 className="font-semibold mb-2">1. Aceitação dos Termos</h3>
            <p className="mb-4">
              Ao acessar e usar o Furia Know Your Fan, você concorda em cumprir
              e estar vinculado aos seguintes termos e condições.
            </p>

            <h3 className="font-semibold mb-2">2. Uso do Serviço</h3>
            <p className="mb-4">
              O serviço é destinado exclusivamente para fãs da FURIA. Você
              concorda em usar o serviço apenas para fins legais e de acordo com
              estes termos.
            </p>

            <h3 className="font-semibold mb-2">3. Privacidade</h3>
            <p className="mb-4">
              Respeitamos sua privacidade. Seus dados serão tratados de acordo
              com nossa Política de Privacidade, que pode ser acessada em
              qualquer momento.
            </p>

            <h3 className="font-semibold mb-2">4. Responsabilidades</h3>
            <p className="mb-4">
              Você é responsável por manter a confidencialidade de suas
              credenciais e por todas as atividades que ocorrem em sua conta.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleAccept}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white hover:text-white"
            >
              Aceitar e Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
