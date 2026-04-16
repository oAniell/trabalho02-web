import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="border-t bg-violet-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-violet-700">
            © {new Date().getFullYear()} CurrículoPro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-violet-700">
            <Link
              href="/curriculos/visualizar"
              className="hover:text-violet-900 transition-colors"
            >
              Currículos
            </Link>
            <Link
              href="/curriculos/cadastrar"
              className="hover:text-violet-900 transition-colors"
            >
              Cadastrar
            </Link>
            <div className="flex items-center gap-2 ml-2">
              <a
                href="https://github.com/oAniell/trabalho02-web"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-900 transition-colors"
              >
                <FiGithub size={16} />
              </a>
              <a
                href="#"
                className="hover:text-violet-900 transition-colors"
              >
                <FiLinkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
