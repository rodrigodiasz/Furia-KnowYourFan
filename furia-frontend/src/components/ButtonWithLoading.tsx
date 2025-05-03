"use client";

import { Button } from "@/components/ui/button";
import { ButtonLoadingHome } from "./ui/buttonloadinghome";

interface ButtonWithLoadingProps {
  isLoading?: boolean;
}

export function ButtonWithLoading({ isLoading }: ButtonWithLoadingProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="bg-zinc-900 dark:bg-white text-white dark:text-black font-bold cursor-pointer dark:hover:bg-zinc-300 hover:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? <ButtonLoadingHome /> : "Entrar"}
    </Button>
  );
}
