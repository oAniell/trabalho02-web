"use client";

import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiStar } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Curriculo } from "@/types/curriculo";
import { calcularPontuacao, gerarSugestoes } from "@/utils/sugestoesCurriculo";

interface SugestoesCurriculoProps {
  curriculo: Curriculo;
}

export function SugestoesCurriculo({ curriculo }: SugestoesCurriculoProps) {
  const sugestoes = gerarSugestoes(curriculo);
  const pontuacao = calcularPontuacao(curriculo);

  const corPontuacao =
    pontuacao >= 80 ? "text-green-600" : pontuacao >= 50 ? "text-yellow-600" : "text-red-600";

  const bgPontuacao =
    pontuacao >= 80 ? "bg-green-50 border-green-200" : pontuacao >= 50 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  return (
    <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-950">
          <FiStar className="text-violet-600" />
          Diagnóstico do currículo
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className={`flex items-center justify-between rounded-lg border p-4 ${bgPontuacao}`}>
          <div>
            <p className="text-sm font-medium text-violet-700">Pontuação de completude</p>
            <p className="text-xs text-violet-500 mt-0.5">Baseada em experiências, formação, habilidades e perfil</p>
          </div>
          <div className={`text-3xl font-bold ${corPontuacao}`}>{pontuacao}<span className="text-base font-normal">/100</span></div>
        </div>

        {sugestoes.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <FiCheckCircle className="h-5 w-5 shrink-0 text-green-600" />
            <p className="text-sm font-medium text-green-700">Currículo completo! Nenhuma sugestão de melhoria.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-violet-700">Sugestões de melhoria:</p>
            {sugestoes.map((s, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  s.tipo === "erro"
                    ? "border-red-200 bg-red-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                {s.tipo === "erro" ? (
                  <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                ) : (
                  <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                )}
                <p className={`text-sm ${s.tipo === "erro" ? "text-red-700" : "text-yellow-700"}`}>
                  {s.mensagem}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
