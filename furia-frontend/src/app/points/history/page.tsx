"use client";

import { useEffect, useState } from "react";
import { getPoints, redeemPoints } from "@/services/pointsService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/NavBar";
import LogoSection from "@/components/Partners";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";

const rewards = [
  {
    id: "tshirt",
    name: "Camiseta Furia",
    description: "Camiseta oficial da Furia com design exclusivo",
    points: 100,
    icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  },
  {
    id: "vip",
    name: "1 Mês de VIP",
    description: "Acesso exclusivo a benefícios VIP por 30 dias",
    points: 200,
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "coupon",
    name: "Cupom de Desconto",
    description: "20% de desconto na próxima compra",
    points: 50,
    icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  },
  {
    id: "Sticker",
    name: "Sticker Furia",
    description: "Adesivo da Furia no CS2",
    points: 5,
    icon: "M9.5 2.5a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2zm6 0a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2zm-6 6a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2zm6 0a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2z",
  },
];

interface PointsData {
  points: number;
  pointsHistory: {
    id: string;
    points: number;
    action: string;
    createdAt: string;
  }[];
  redemptionHistory: {
    id: string;
    points: number;
    createdAt: string;
  }[];
}

export default function PointsHistoryPage() {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getPoints();
        setPointsData({
          points: data.points,
          pointsHistory: data.pointsHistory,
          redemptionHistory: [], 
        });
        setError(null);
      } catch (error: any) {
        console.error("Error fetching points:", error);
        if (error.response?.status === 401) {
          setError("Você precisa estar logado para ver seu histórico");
          router.push("/");
        } else {
          setError("Erro ao carregar histórico. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [router]);

  const handleRedeem = async (rewardId: string, points: number) => {
    if (isButtonDisabled) return;

    try {
      setIsButtonDisabled(true);
      setRedeeming(rewardId);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await redeemPoints(rewardId, points);
      const updatedData = await getPoints();
      setPointsData({
        points: updatedData.points,
        pointsHistory: updatedData.pointsHistory,
        redemptionHistory: [], 
      });

      toast.success("Resgate realizado com sucesso!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Error redeeming points:", error);
      toast.error(error.message || "Erro ao resgatar pontos");
    } finally {
      setRedeeming(null);
      setIsButtonDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando histórico...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pointsData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-600">
              <p>Nenhum histórico encontrado</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen container mx-auto bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Header />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="dark:bg-card border-2 border-zinc-300 dark:border-zinc-700 dark:shadow-none rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-200">
                  Resgate de Pontos
                </h1>
              </div>
              <div className="h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="card bg-base-100 shadow-lg border-2 border-zinc-300 dark:border-zinc-700 rounded-lg"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={reward.icon}
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h2 className="card-title text-lg">
                              {reward.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {reward.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 font-semibold">
                              {reward.points} pts
                            </span>
                            <Button
                              variant="outline"
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                              onClick={() =>
                                handleRedeem(reward.id, reward.points)
                              }
                              disabled={
                                redeeming === reward.id ||
                                pointsData.points < reward.points ||
                                isButtonDisabled
                              }
                            >
                              {redeeming === reward.id ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Resgatando...</span>
                                </div>
                              ) : (
                                "Resgatar"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="dark:bg-card border-2 border-zinc-300 dark:border-zinc-700 dark:shadow-none rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-200">
                  Histórico de Pontos
                </h1>
              </div>

              <div className="h-[500px] overflow-y-auto">
                {pointsData.pointsHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    Nenhum histórico de pontos encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pointsData.pointsHistory.map((history) => (
                      <div
                        key={history.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {getActionDescription(history.action)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(history.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              history.points > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {history.points > 0 ? "+" : ""}
                            {history.points}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <LogoSection />
      </div>
      <Footer />
    </>
  );
}

function getActionDescription(action: string): string {
  const actionMap: Record<string, string> = {
    PROFILE_UPDATE: "Atualização de Perfil",
    DOCUMENT_VALIDATION: "Validação de Documento",
    SOCIAL_LINK_TWITTER: "Vínculo com Twitter",
    SOCIAL_LINK_INSTAGRAM: "Vínculo com Instagram",
    SOCIAL_LINK_FACEBOOK: "Vínculo com Facebook",
    SOCIAL_LINK_TWITCH: "Vínculo com Twitch",
    SOCIAL_LINK_DISCORD: "Vínculo com Discord",
    ESPORTS_VALIDATION_STEAM: "Validação de Perfil Steam",
    ESPORTS_VALIDATION_VALORANT: "Validação de Perfil Valorant",
    ESPORTS_VALIDATION_GAMERSCLUB: "Validação de Perfil GamersClub",
    ESPORTS_VALIDATION_LOL: "Validação de Perfil League of Legends",
    ESPORTS_VALIDATION_CS2: "Validação de Perfil CS2",
    ESPORTS_VALIDATION_RAINBOWSIX: "Validação de Perfil Rainbow Six",
    REDEMPTION_tshirt: "Resgate: Camiseta Furia",
    REDEMPTION_vip: "Resgate: 1 Mês de VIP",
    REDEMPTION_coupon: "Resgate: Cupom de Desconto",
    REDEMPTION_Sticker: "Resgate: Sticker Furia",
  };

  return actionMap[action] || action;
}
