"use client";

import { Curriculo } from "@/types/curriculo";
import { CardCurriculo } from "./CardCurriculo";

interface ListaCurriculosProps {
  curriculos: (Curriculo & { pontuacaoAderencia?: number })[];
  destacarPrimeiros?: boolean;
}

export function ListaCurriculos({ curriculos, destacarPrimeiros }: ListaCurriculosProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {curriculos.map((curriculo, idx) => (
        <CardCurriculo
          key={curriculo.id}
          curriculo={curriculo}
          destaque={destacarPrimeiros && idx === 0}
        />
      ))}
    </div>
  );
}
