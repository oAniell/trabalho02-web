"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCurriculos } from "@/lib/storage";
import { Curriculo } from "@/types/curriculo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FiUser, FiBriefcase, FiFileText, FiPlusCircle, FiSearch } from "react-icons/fi";

export default function VisualizarPage() {
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getCurriculos();
      setCurriculos(data);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredCurriculos = curriculos.filter((c) => {
    const term = debouncedSearch.toLowerCase();
    return c.nome.toLowerCase().includes(term) || c.cargo.toLowerCase().includes(term);
  });

  const goTo = (path: string) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Meus Currículos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center gap-3">
                    <Skeleton className="w-20 h-20 rounded-full ring-4 ring-indigo-100" />
                    <div className="flex-1 w-full space-y-2">
                      <Skeleton className="h-6 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                      <Skeleton className="h-3 w-full mt-4" />
                      <Skeleton className="h-3 w-4/5 mx-auto" />
                      <Skeleton className="h-3 w-2/3 mx-auto" />
                    </div>
                  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Meus Currículos</h1>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-100">
              <FiFileText className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum currículo encontrado</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Você ainda não criou nenhum currículo. Comece agora e conquiste seu próximo emprego!
            </p>
            <button
              onClick={() => goTo("/curriculos/cadastrar")}
              className="inline-flex items-center justify-center gap-2 h-10 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <FiPlusCircle className="w-4 h-4" />
              Criar meu primeiro currículo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Currículos</h1>
            <p className="text-gray-500 text-sm mt-1">{curriculos.length} currículo{curriculos.length !== 1 ? 's' : ''} encontrado{curriculos.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou cargo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 bg-white"
              />
            </div>
            <button
              onClick={() => goTo("/curriculos/cadastrar")}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <FiPlusCircle className="w-4 h-4" />
              Novo Currículo
            </button>
          </div>
        </div>

        {filteredCurriculos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h2>
            <p className="text-gray-500">Tente buscar com outros termos ou crie um novo currículo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCurriculos.map((curriculo) => (
              <button
                key={curriculo.id}
                onClick={() => goTo(`/curriculos/visualizar/${curriculo.id}`)}
                className="text-left group"
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-violet-50">
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all">
                        {curriculo.foto ? (
                          <Image
                            src={curriculo.foto}
                            alt={curriculo.nome}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500">
                            <FiUser className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-indigo-700 transition-colors">{curriculo.nome}</h3>
                        <div className="flex items-center justify-center gap-1.5 text-indigo-600 text-sm font-medium mt-1">
                          <FiBriefcase className="w-4 h-4" />
                          <span className="truncate">{curriculo.cargo}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-3 line-clamp-3 leading-relaxed">{curriculo.resumoProfissional}</p>
                        {curriculo.habilidades && curriculo.habilidades.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                            {curriculo.habilidades.slice(0, 3).map((hab, idx) => (
                              <span key={idx} className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                {hab}
                              </span>
                            ))}
                            {curriculo.habilidades.length > 3 && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}