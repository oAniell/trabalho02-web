"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FormCurriculo, CurriculoFormData } from "@/components/FormCurriculo";
import { saveCurriculo } from "@/lib/curriculoService";

export default function CadastrarPage() {
  const router = useRouter();

  const handleSubmit = async (data: CurriculoFormData) => {
    try {
      await saveCurriculo(data);
      toast.success("Curriculo cadastrado com sucesso!");
      router.push("/curriculos/visualizar");
    } catch (err) {
      console.error("Erro ao cadastrar curriculo:", err);
      toast.error("Erro ao cadastrar curriculo. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 py-8">
      <FormCurriculo onSubmit={handleSubmit} submitLabel="Salvar curriculo" />
    </div>
  );
}
