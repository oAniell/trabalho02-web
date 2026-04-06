"use client";

import { Curriculo } from "@/types/curriculo";
import { curriculosMock } from "@/data/curriculos";

const STORAGE_KEY = "curriculos";

export function getCurriculos(): Curriculo[] {
  if (typeof window === "undefined") return curriculosMock;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculosMock));
    return curriculosMock;
  }
  return JSON.parse(stored) as Curriculo[];
}

export function getCurriculoById(id: string): Curriculo | undefined {
  return getCurriculos().find((c) => c.id === id);
}

export function saveCurriculo(curriculo: Omit<Curriculo, "id">): Curriculo {
  const lista = getCurriculos();
  const novo: Curriculo = {
    ...curriculo,
    id: Date.now().toString(),
  };
  lista.push(novo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return novo;
}

export function deleteCurriculo(id: string): void {
  const lista = getCurriculos().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}
