"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "@/components/ui/switch";
import { PointsDisplay } from "./PointsDisplay";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    deleteCookie("session");
    toast.success("Sessão encerrada com sucesso!");
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between mb-20">
      <Link href="/home">
        <Image
          src={
            currentTheme === "dark"
              ? "/furia-mobile.svg"
              : "/logo-furia-black.svg"
          }
          alt="Logo"
          width={100}
          height={100}
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-5">
        <PointsDisplay />
        <Link href="/settings">
          <Button
            variant="outline"
            className="text-black dark:text-zinc-200 dark:hover:text-zinc-400 rounded-md cursor-pointer"
          >
            Meu Perfil
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-black dark:text-zinc-200 rounded-md hover:text-red-500 cursor-pointer"
          >
            Sair
          </Button>
        </Link>
        <ThemeSwitch />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <PointsDisplay />
            <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="outline"
                className="text-black dark:text-zinc-200 dark:hover:text-zinc-400 rounded-md cursor-pointer w-32"
              >
                Meu Perfil
              </Button>
            </Link>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-black dark:text-zinc-200 rounded-md hover:text-red-500 cursor-pointer w-32"
              >
                Sair
              </Button>
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      )}
    </header>
  );
}
