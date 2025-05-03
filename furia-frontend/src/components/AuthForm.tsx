"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";
import { loginAction } from "@/components/LoginAction";

import Logo from "../../public/logo-login.png";

export type AuthFormType = "signup" | "login";

interface AuthFormProps {
  type: AuthFormType;
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (type === "signup") {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!name || !email || !password) {
        toast.error("Por favor, preencha todos os campos.");
        setLoading(false);
        return;
      }

      if (name.length < 3) {
        toast.error("O nome deve ter pelo menos 3 letras.");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Erro ao cadastrar");
        }

        toast.success("Cadastro realizado com sucesso!");
        router.push("/");
      } catch (err: any) {
        toast.error(err.message);
        setLoading(false);
      }
    } else {
      try {
        const result = await loginAction(formData);

        if (result?.error) {
          toast.error(result.error);
          setLoading(false);
        } else if (result?.success) {
          window.location.href = "/home";
        }
      } catch (err) {
        toast.error("Erro inesperado. Tente novamente.");
        console.error("Erro no login:", err);
        setLoading(false);
      }
    }
  }

  return (
    <main className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <Image src={Logo} alt="Logo" width={150} height={150} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-xl px-2"
      >
        {type === "signup" && (
          <Input type="text" name="name" placeholder="Nome" />
        )}
        <Input type="email" name="email" placeholder="E-mail" required />
        <Input type="password" name="password" placeholder="Senha" required />

        {type === "signup" ? (
          <Button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black font-bold cursor-pointer dark:hover:bg-zinc-300 hover:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Carregando..." : "Cadastrar-se"}
          </Button>
        ) : (
          <ButtonWithLoading isLoading={loading} />
        )}
      </form>

      <p className="text-zinc-500 dark:text-zinc-300">
        {type === "signup" ? (
          <>
            Já tem uma conta?{" "}
            <Link className="dark:text-white text-black font-bold" href="/">
              Faça login
            </Link>
          </>
        ) : (
          <>
            Não possui uma conta?{" "}
            <Link
              className="dark:text-white text-black font-bold"
              href="/signup"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </p>
    </main>
  );
}
