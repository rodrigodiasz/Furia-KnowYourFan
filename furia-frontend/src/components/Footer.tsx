import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Furia. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6">
              <Link
                href="https://x.com/FURIA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-zinc-300 transition-colors text-xl"
                aria-label="Twitter"
              >
                <FaXTwitter />
              </Link>
              <Link
                href="https://www.instagram.com/furiagg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-zinc-300 transition-colors text-xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </Link>
              <Link
                href="https://www.facebook.com/furiagg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-zinc-300 transition-colors text-xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </Link>
            </div>
          </div>

          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-zinc-300 transition-colors"
            >
              Termos de Serviço
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-zinc-300 transition-colors"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
