import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Curriculo } from "@/types/curriculo";

const COLLECTION_NAME = "curriculos";

// ─── Teste de conexão ────────────────────────────────────────────────────────

export async function testarConexaoFirestore() {
  const q = query(collection(db, COLLECTION_NAME), limit(1));
  const snapshot = await getDocs(q);
  return {
    ok: true,
    totalEncontrado: snapshot.size,
  };
}

// ─── Listar todos ────────────────────────────────────────────────────────────

export async function getCurriculos(): Promise<Curriculo[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("nome", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Curriculo[];
}

// ─── Buscar por ID ───────────────────────────────────────────────────────────

export async function getCurriculoById(id: string): Promise<Curriculo | undefined> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return undefined;
  return { id: snapshot.id, ...snapshot.data() } as Curriculo;
}

// ─── Pesquisar por nome ──────────────────────────────────────────────────────

export async function pesquisarCurriculosPorNome(nome: string): Promise<Curriculo[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("nome", ">=", nome),
    where("nome", "<=", nome + "\uf8ff")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Curriculo[];
}

// ─── Pesquisar por cargo ─────────────────────────────────────────────────────

export async function pesquisarCurriculosPorCargo(cargo: string): Promise<Curriculo[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("cargo", ">=", cargo),
    where("cargo", "<=", cargo + "\uf8ff")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Curriculo[];
}

// ─── Cadastrar ───────────────────────────────────────────────────────────────

export async function saveCurriculo(curriculo: Omit<Curriculo, "id">): Promise<Curriculo> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...curriculo,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...curriculo };
}

// ─── Atualizar ───────────────────────────────────────────────────────────────

export async function updateCurriculo(
  id: string,
  curriculo: Omit<Curriculo, "id">
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...curriculo,
    updatedAt: serverTimestamp(),
  });
}

// ─── Excluir ─────────────────────────────────────────────────────────────────

export async function deleteCurriculo(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
