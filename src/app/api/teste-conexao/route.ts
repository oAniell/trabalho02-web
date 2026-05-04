import { NextResponse } from "next/server";
import { testarConexaoFirestore } from "@/lib/curriculoService";

export async function GET() {
  try {
    const resultado = await testarConexaoFirestore();
    return NextResponse.json({
      sucesso: true,
      mensagem: "Conexão com Firestore OK",
      resultado,
    });
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Falha na conexão com Firestore",
      },
      { status: 500 }
    );
  }
}
