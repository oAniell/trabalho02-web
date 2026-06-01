"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Curriculo } from "@/types/curriculo";

const PHOTO_PREVIEWS_KEY = "curriculoFotoPreviews";

function isRenderableImage(src?: string) {
  return Boolean(src && /^(\/|https?:\/\/|data:image\/|blob:)/.test(src));
}

function getPhotoPreview(fileName?: string) {
  if (!fileName || typeof window === "undefined") return undefined;
  const stored = localStorage.getItem(PHOTO_PREVIEWS_KEY);
  if (!stored) return undefined;
  try {
    return (JSON.parse(stored) as Record<string, string>)[fileName];
  } catch {
    return undefined;
  }
}

interface CardCurriculoProps {
  curriculo: Curriculo;
  destaque?: boolean;
}

export function CardCurriculo({ curriculo, destaque }: CardCurriculoProps) {
  const router = useRouter();
  const photoSrc = isRenderableImage(curriculo.foto)
    ? curriculo.foto
    : getPhotoPreview(curriculo.foto);

  return (
    <button
      onClick={() => router.push(`/curriculos/visualizar/${curriculo.id}`)}
      className="text-left group w-full"
    >
      <Card
        className={`h-full transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-1 hover:border-violet-300 hover:bg-gradient-to-br hover:from-violet-50 hover:to-fuchsia-50 ${
          destaque ? "border-violet-300 ring-2 ring-violet-200" : "border-violet-100"
        }`}
      >
        <CardContent className="p-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gradient-to-br from-violet-100 to-fuchsia-100 ring-4 ring-violet-100 group-hover:ring-violet-200 transition-all">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={curriculo.nome}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <h3 className="font-bold text-violet-900 text-lg truncate group-hover:text-violet-700 transition-colors">
                {curriculo.nome}
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-violet-600 text-sm font-medium mt-1">
                <FiBriefcase className="w-4 h-4 shrink-0" />
                <span className="truncate">{curriculo.cargo}</span>
              </div>
              <p className="text-violet-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                {curriculo.resumoProfissional}
              </p>
              {curriculo.habilidades && curriculo.habilidades.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {curriculo.habilidades.slice(0, 3).map((hab, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full"
                    >
                      {hab}
                    </span>
                  ))}
                  {curriculo.habilidades.length > 3 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-600 rounded-full">
                      +{curriculo.habilidades.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
