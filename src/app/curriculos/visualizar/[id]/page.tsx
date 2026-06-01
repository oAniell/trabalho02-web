"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiEdit2,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SugestoesCurriculo } from "@/components/SugestoesCurriculo";
import { deleteCurriculo, getCurriculoById } from "@/lib/curriculoService";
import { Curriculo } from "@/types/curriculo";

const PHOTO_PREVIEWS_KEY = "curriculoFotoPreviews";

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

function formatCreatedAt(createdAt?: Curriculo["createdAt"]): string | null {
  if (!createdAt) return null;
  try {
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return null;
  }
}

export default function DetalhesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getCurriculoById(id);
        if (!cancelled) setCurriculo(data ?? null);
      } catch (err) {
        console.error("Erro ao carregar curriculo:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const excluir = async () => {
    setExcluindo(true);
    try {
      await deleteCurriculo(id);
      toast.success("Curriculo excluido com sucesso!");
      router.push("/curriculos/visualizar");
    } catch (err) {
      console.error("Erro ao excluir curriculo:", err);
      toast.error("Erro ao excluir curriculo.");
      setExcluindo(false);
      setConfirmarExclusao(false);
    }
  };

  if (loading) return <DetalhesSkeleton />;

  if (!curriculo) {
    return (
      <div className="min-h-screen bg-violet-50 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <FiUser className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-violet-950">Curriculo nao encontrado</h1>
            <p className="mt-2 text-sm text-violet-600">O registro solicitado nao esta disponivel.</p>
          </div>
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

  const photoSrc =
    curriculo.foto && /^(\/|https?:\/\/|data:image\/|blob:)/.test(curriculo.foto)
      ? curriculo.foto
      : getPhotoPreview(curriculo.foto);

  const dataCriacao = formatCreatedAt(curriculo.createdAt);

  return (
    <div className="min-h-screen bg-violet-50 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">

        {/* ── Ações ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/curriculos/visualizar")}
            className="w-fit border-violet-200 bg-white"
          >
            <FiArrowLeft />
            Voltar
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/curriculos/visualizar/${id}/editar`)}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              <FiEdit2 />
              Editar
            </Button>

            {confirmarExclusao ? (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
                <span className="text-sm font-medium text-red-700">Confirmar exclusao?</span>
                <Button
                  size="sm"
                  onClick={excluir}
                  disabled={excluindo}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {excluindo ? "Excluindo..." : "Sim, excluir"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmarExclusao(false)}
                  disabled={excluindo}
                  className="border-red-200 text-red-700"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setConfirmarExclusao(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <FiTrash2 />
                Excluir
              </Button>
            )}
          </div>
        </div>

        {/* ── Dados pessoais ──────────────────────────────────────────────── */}
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[180px_1fr]">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg bg-violet-100 text-violet-600">
                {photoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoSrc} alt={curriculo.nome} className="h-full w-full object-cover" />
                ) : (
                  <FiUser className="h-16 w-16" />
                )}
              </div>
              {curriculo.foto && <span className="break-all text-xs text-violet-500">{curriculo.foto}</span>}
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-violet-600">Detalhes do curriculo</p>
                <h1 className="mt-1 text-3xl font-bold text-violet-950">{curriculo.nome}</h1>
                <p className="mt-2 flex items-center gap-2 text-lg font-medium text-violet-700">
                  <FiBriefcase />
                  {curriculo.cargo}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-violet-700 md:grid-cols-2">
                <Info icon={<FiMail />} label="E-mail" value={curriculo.email} />
                <Info icon={<FiPhone />} label="Telefone" value={curriculo.telefone} />
                <Info icon={<FiUser />} label="CPF" value={curriculo.cpf} />
                <Info icon={<FiCalendar />} label="Data de nascimento" value={curriculo.dataNascimento} />
                {curriculo.linkedin && <Info icon={<FiLinkedin />} label="LinkedIn" value={curriculo.linkedin} />}
                {curriculo.github && <Info icon={<FiGithub />} label="GitHub" value={curriculo.github} />}
                {dataCriacao && <Info icon={<FiClock />} label="Cadastrado em" value={dataCriacao} />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Resumo profissional ─────────────────────────────────────────── */}
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-violet-950">Resumo profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-violet-700">{curriculo.resumoProfissional}</p>
          </CardContent>
        </Card>

        {/* ── Experiências ────────────────────────────────────────────────── */}
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-violet-950">Experiencias profissionais</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {curriculo.experiencias.map((experiencia, index) => (
              <div key={`${experiencia.empresa}-${index}`} className="rounded-lg border border-violet-100 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-violet-950">{experiencia.cargo}</h2>
                    <p className="text-sm font-medium text-violet-700">{experiencia.empresa}</p>
                  </div>
                  <span className="text-sm text-violet-500">
                    {experiencia.dataInicio} - {experiencia.dataFim}
                  </span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm leading-relaxed text-violet-700">{experiencia.descricao}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Formação acadêmica ──────────────────────────────────────────── */}
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-violet-950">Formacao academica</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {curriculo.formacoes.map((formacao, index) => (
              <div key={`${formacao.instituicao}-${index}`} className="rounded-lg border border-violet-100 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-violet-950">{formacao.curso}</h2>
                    <p className="text-sm font-medium text-violet-700">{formacao.instituicao}</p>
                    <p className="text-sm text-violet-600">{formacao.grau}</p>
                  </div>
                  <span className="text-sm text-violet-500">
                    {formacao.dataInicio} - {formacao.dataFim}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Habilidades ─────────────────────────────────────────────────── */}
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-violet-950">Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {curriculo.habilidades.length > 0 ? (
                curriculo.habilidades.map((habilidade) => (
                  <Badge key={habilidade} className="bg-violet-100 text-violet-700">
                    {habilidade}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-violet-500">Nenhuma habilidade cadastrada.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Diagnóstico ─────────────────────────────────────────────────── */}
        <SugestoesCurriculo curriculo={curriculo} />
      </div>
    </div>
  );
}

function DetalhesSkeleton() {
  return (
    <div className="min-h-screen bg-violet-50 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex justify-between">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[180px_1fr]">
            <Skeleton className="h-40 w-40 rounded-lg" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-72 max-w-full" />
              <Skeleton className="h-6 w-56 max-w-full" />
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-lg border-violet-100 bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-52" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-violet-100 bg-violet-50 p-3">
      <span className="mt-0.5 text-violet-600">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase text-violet-500">{label}</p>
        <p className="break-words font-medium text-violet-900">{value}</p>
      </div>
    </div>
  );
}
