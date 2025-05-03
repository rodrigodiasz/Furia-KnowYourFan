"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  CreditCard,
  Heart,
  Activity,
  Calendar,
  ShoppingCart,
  Twitter,
  Instagram,
  Facebook,
  Gamepad,
  Trophy,
} from "lucide-react";
import SocialAccounts from "@/components/SocialAccounts";

interface UserProfile {
  name: string;
  address: string;
  cpf: string;
  interests: string;
  activities: string;
  events: string;
  purchases: string;
  twitterId: string;
  instagramId: string;
  facebookId: string;
  steam: string;
  valorant: string;
  gamersclub: string;
  lol: string;
  cs2: string;
  rainbowSix: string;
  twitchId: string;
  discordId: string;
}

interface SocialAccount {
  provider: string;
  socialId: string;
  url: string;
}

export function UserProfileCard() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = getCookie("session");
        if (!token) {
          console.warn("Token não encontrado");
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

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserData(userData);

          const socialAccounts: SocialAccount[] = [];

          if (userData.twitterId) {
            socialAccounts.push({
              provider: "twitter",
              socialId: userData.twitterId,
              url: `https://twitter.com/${userData.twitterId}`,
            });
          }

          if (userData.instagramId) {
            socialAccounts.push({
              provider: "instagram",
              socialId: userData.instagramId,
              url: `https://instagram.com/${userData.instagramId}`,
            });
          }

          if (userData.facebookId) {
            socialAccounts.push({
              provider: "facebook",
              socialId: userData.facebookId,
              url: `https://facebook.com/${userData.facebookId}`,
            });
          }

          if (userData.twitchId) {
            socialAccounts.push({
              provider: "twitch",
              socialId: userData.twitchId,
              url: `https://twitch.tv/${userData.twitchId}`,
            });
          }

          if (userData.discordId) {
            socialAccounts.push({
              provider: "discord",
              socialId: userData.discordId,
              url: "#",
            });
          }

          setLinkedAccounts(socialAccounts);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-200"></div>
          <div className="h-4 w-32 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Data */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-white dark:bg-card rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <User className="w-5 h-5" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{userData.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Endereço</p>
                <p className="font-medium">{userData.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{userData.cpf}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests and Activities */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-white dark:bg-card rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Activity className="w-5 h-5" />
            Interesses e Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Interesses</p>
                <p className="font-medium">{userData.interests}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Atividades</p>
                <p className="font-medium">{userData.activities}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Eventos</p>
                <p className="font-medium">{userData.events}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShoppingCart className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Compras</p>
                <p className="font-medium">{userData.purchases}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Accounts */}

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-white dark:bg-card rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Activity className="w-5 h-5" />
            Sociais
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 capitalize">
          <SocialAccounts linkedAccounts={linkedAccounts} />
        </CardContent>
      </Card>

      {/* eSports Profiles */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-white dark:bg-card rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Trophy className="w-5 h-5" />
            Perfis de e-Sports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.steam && (
              <div className="flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Steam</p>
                  <p className="font-medium">{userData.steam}</p>
                </div>
              </div>
            )}
            {userData.valorant && (
              <div className="flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Valorant</p>
                  <p className="font-medium">{userData.valorant}</p>
                </div>
              </div>
            )}
            {userData.lol && (
              <div className="flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">LoL</p>
                  <p className="font-medium">{userData.lol}</p>
                </div>
              </div>
            )}
            {userData.cs2 && (
              <div className="flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">CS2</p>
                  <p className="font-medium">{userData.cs2}</p>
                </div>
              </div>
            )}
            {userData.gamersclub && (
              <div className="flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">GC</p>
                  <p className="font-medium">{userData.gamersclub}</p>
                </div>
              </div>
            )}
            {userData.rainbowSix && (
              <div className="flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Rainbow Six</p>
                  <p className="font-medium">{userData.rainbowSix}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
