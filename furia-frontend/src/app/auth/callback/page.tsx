import { Suspense } from "react";
import CallbackHandler from "@/components/CallbackHandler";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center">Carregando...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
