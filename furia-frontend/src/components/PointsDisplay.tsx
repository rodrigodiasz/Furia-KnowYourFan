"use client";

import { useEffect, useState } from "react";
import { getPoints, PointsData } from "@/services/pointsService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy } from "lucide-react";

export function PointsDisplay() {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getPoints();
        setPointsData(data);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching points:", error);
        if (error.response?.status === 401) {
          setError("Você precisa estar logado para ver seus pontos");
          router.push("/");
        } else {
          setError("Erro ao carregar pontos. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [router]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
          <div className="h-4 w-16 bg-yellow-400 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white rounded-lg p-2 text-center text-sm">
        {error}
      </div>
    );
  }

  if (!pointsData) {
    return (
      <div className="bg-gray-500 text-white rounded-lg p-2 text-center text-sm">
        Nenhum dado de pontos encontrado
      </div>
    );
  }

  return (
    <Link href="/points/history">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-1.5 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="h-4 w-4 text-yellow-200" />
          <span className="font-bold text-yellow-100">
            {pointsData.points} Pontos
          </span>
        </div>
      </div>
    </Link>
  );
}
