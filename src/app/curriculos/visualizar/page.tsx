"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurriculos } from "@/lib/curriculoService";
import { Curriculo } from "@/types/curriculo";
import { ListaCurriculos } from "@/components/ListaCurriculos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { buscarPorAderencia } from "@/utils/sugestoesCurriculo";
import { FiFileText, FiPlusCircle, FiSearch, FiStar } from "react-icons/fi";

export default function VisualizarPage() {
  const router = useRouter();
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState("");
  const [debouncedNome, setDebouncedNome] = useState("");

  const [buscaAderencia, setBuscaAderencia] = useState("");
  const [debouncedAderencia, setDebouncedAderencia] = useState("");

  useEffect(() => {
    let cancelled = false;
    getCurriculos().then((data) => {
      if (!cancelled) {
        setCurriculos(data);
        setLoading(false);
      }
    }).catch((err) => {
      console.error("Erro ao carregar curriculos:", err);
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedNome(buscaNome), 300);
    return () => clearTimeout(t);
  }, [buscaNome]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedAderencia(buscaAderencia), 400);
    return () => clearTimeout(t);
  }, [buscaAderencia]);

  const filtradosPorNome = curriculos.filter((c) => {
    const term = debouncedNome.toLowerCase();
    return c.nome.toLowerCase().includes(term) || c.cargo.toLowerCase().includes(term);
  });

  const filtradosPorAderencia = buscarPorAderencia(curriculos, debouncedAderencia);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white border-violet-100 shadow-sm">
                <CardContent className="p-5 flex flex-col items-center gap-3">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (curriculos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl font-bold text-violet-900 mb-8">Meus Curriculos</h1>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mb-6">
              <FiFileText className="w-10 h-10 text-violet-600" />
            </div>
            <h2 className="text-xl font-semibold text-violet-900 mb-2">Nenhum curriculo encontrado</h2>
            <p className="text-violet-600 mb-6 max-w-md">
              Voce ainda nao criou nenhum curriculo. Comece agora e conquiste seu proximo emprego!
            </p>
            <button
              onClick={() => router.push("/curriculos/cadastrar")}
              className="inline-flex items-center gap-2 h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              <FiPlusCircle className="w-4 h-4" />
              Criar meu primeiro curriculo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-10">

        {/* ── Cabeçalho e busca por nome/cargo ───────────────────────────── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-violet-900">Meus Curriculos</h1>
              <p className="text-violet-600 text-sm mt-1">
                {curriculos.length} curriculo{curriculos.length !== 1 ? "s" : ""} encontrado{curriculos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou cargo..."
                  value={buscaNome}
                  onChange={(e) => setBuscaNome(e.target.value)}
                  className="pl-9 w-64 bg-white"
                />
              </div>
              <button
                onClick={() => router.push("/curriculos/cadastrar")}
                className="inline-flex items-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-all"
              >
                <FiPlusCircle className="w-4 h-4" />
                Novo Curriculo
              </button>
            </div>
          </div>

          {filtradosPorNome.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <FiSearch className="w-7 h-7 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-violet-900 mb-1">Nenhum resultado encontrado</h2>
              <p className="text-violet-600 text-sm">Tente buscar com outros termos.</p>
            </div>
          ) : (
            <ListaCurriculos curriculos={filtradosPorNome} />
          )}
        </div>

        {/* ── Sugestão por aderência ──────────────────────────────────────── */}
        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-950">
              <FiStar className="text-violet-600" />
              Busca por aderencia
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-violet-600">
              Digite as habilidades, cargo ou formacao desejados. Os curriculos serao ordenados pelo nivel de aderencia.
            </p>
            <div className="relative">
              <FiStar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
              <Input
                type="text"
                placeholder="Ex: React TypeScript Node.js..."
                value={buscaAderencia}
                onChange={(e) => setBuscaAderencia(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>

            {debouncedAderencia.trim() && (
              <>
                {filtradosPorAderencia.length === 0 ? (
                  <p className="text-sm text-violet-500 py-4 text-center">
                    Nenhum curriculo com aderencia a &quot;{debouncedAderencia}&quot;.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-violet-700">
                      {filtradosPorAderencia.length} curriculo{filtradosPorAderencia.length !== 1 ? "s" : ""} com aderencia — ordenados pelo melhor match:
                    </p>
                    <ListaCurriculos curriculos={filtradosPorAderencia} destacarPrimeiros />
                  </div>
                )}
              </>
            )}

            {!debouncedAderencia.trim() && (
              <div className="rounded-lg border border-dashed border-violet-200 py-8 text-center text-sm text-violet-400">
                Digite acima para ver os curriculos ranqueados por aderencia
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
