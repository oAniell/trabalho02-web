"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiArrowLeft, FiUser } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormCurriculo, CurriculoFormData } from "@/components/FormCurriculo";
import { getCurriculoById, updateCurriculo } from "@/lib/curriculoService";
import { Curriculo } from "@/types/curriculo";

function buildDefaultValues(curriculo: Curriculo): CurriculoFormData {
  const { id: _id, createdAt: _createdAt, ...rest } = curriculo;
  void _id;
  void _createdAt;
  return rest;
}

export default function EditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCurriculoById(id).then((data) => {
      if (!cancelled) {
        setCurriculo(data ?? null);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (data: CurriculoFormData) => {
    try {
      await updateCurriculo(id, data);
      toast.success("Curriculo atualizado com sucesso!");
      router.push(`/curriculos/visualizar/${id}`);
    } catch (err) {
      console.error("Erro ao atualizar curriculo:", err);
      toast.error("Erro ao atualizar curriculo. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-violet-50 py-8">
        <div className="mx-auto w-full max-w-6xl px-4 flex flex-col gap-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!curriculo) {
    return (
      <div className="min-h-screen bg-violet-50 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <FiUser className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold text-violet-950">Curriculo nao encontrado</h1>
          <Button
            onClick={() => router.push("/curriculos/visualizar")}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            <FiArrowLeft />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50 py-8">
      <FormCurriculo
        defaultValues={buildDefaultValues(curriculo)}
        onSubmit={handleSubmit}
        submitLabel="Salvar alteracoes"
        onCancel={() => router.push(`/curriculos/visualizar/${id}`)}
        title={`Editar curriculo`}
        subtitle={`Atualize os dados do curriculo de ${curriculo.nome}.`}
      />
    </div>
  );
}
