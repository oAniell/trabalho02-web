import { Curriculo } from "@/types/curriculo";

export interface Sugestao {
  mensagem: string;
  tipo: "aviso" | "erro";
}

export function gerarSugestoes(curriculo: Curriculo): Sugestao[] {
  const sugestoes: Sugestao[] = [];

  if (curriculo.resumoProfissional.trim().length < 100) {
    sugestoes.push({
      mensagem: "Resumo profissional muito curto. Descreva melhor suas experiências e objetivos.",
      tipo: "aviso",
    });
  }

  if (!curriculo.experiencias || curriculo.experiencias.length === 0) {
    sugestoes.push({
      mensagem: "Nenhuma experiência profissional cadastrada.",
      tipo: "erro",
    });
  }

  if (!curriculo.formacoes || curriculo.formacoes.length === 0) {
    sugestoes.push({
      mensagem: "Nenhuma formação acadêmica cadastrada.",
      tipo: "erro",
    });
  }

  const numHab = curriculo.habilidades?.length ?? 0;
  if (numHab < 3) {
    sugestoes.push({
      mensagem: `Poucas habilidades (${numHab}). Adicione pelo menos 3 para aumentar suas chances.`,
      tipo: "aviso",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(curriculo.email)) {
    sugestoes.push({ mensagem: "E-mail inválido.", tipo: "erro" });
  }

  if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(curriculo.telefone)) {
    sugestoes.push({ mensagem: "Telefone inválido.", tipo: "erro" });
  }

  const cargo = curriculo.cargo.toLowerCase();
  const habilidades = (curriculo.habilidades ?? []).map((h) => h.toLowerCase());

  const mapaCargoHabilidades: Record<string, string[]> = {
    frontend: ["react", "vue", "angular", "html", "css", "javascript", "typescript", "next"],
    backend: ["node", "python", "java", "php", "ruby", "go", "rust", "express", "sql", "django"],
    fullstack: ["react", "node", "javascript", "typescript", "html"],
    mobile: ["react native", "flutter", "swift", "kotlin", "android", "ios"],
    devops: ["docker", "kubernetes", "aws", "azure", "gcp", "linux", "terraform"],
    dados: ["python", "sql", "pandas", "power bi", "tableau", "excel", "machine learning"],
    "data science": ["python", "r", "machine learning", "sql", "pandas", "numpy"],
    designer: ["figma", "photoshop", "illustrator", "ux", "ui", "adobe"],
    qa: ["selenium", "cypress", "jest", "testing", "qualidade", "teste"],
  };

  for (const [area, skills] of Object.entries(mapaCargoHabilidades)) {
    if (cargo.includes(area)) {
      const temCompativel = skills.some((skill) =>
        habilidades.some((h) => h.includes(skill))
      );
      if (!temCompativel) {
        sugestoes.push({
          mensagem: `Cargo "${curriculo.cargo}" pode ser incompatível com as habilidades informadas. Adicione habilidades relacionadas à área.`,
          tipo: "aviso",
        });
        break;
      }
    }
  }

  return sugestoes;
}

export function calcularPontuacao(curriculo: Curriculo): number {
  let pontos = 0;

  const resumoLen = curriculo.resumoProfissional.trim().length;
  if (resumoLen >= 200) pontos += 20;
  else if (resumoLen >= 100) pontos += 15;
  else if (resumoLen >= 20) pontos += 8;

  const numExp = curriculo.experiencias?.length ?? 0;
  if (numExp >= 3) pontos += 25;
  else if (numExp >= 1) pontos += 15;

  const numForm = curriculo.formacoes?.length ?? 0;
  if (numForm >= 2) pontos += 20;
  else if (numForm >= 1) pontos += 12;

  const numHab = curriculo.habilidades?.length ?? 0;
  if (numHab >= 8) pontos += 20;
  else if (numHab >= 5) pontos += 15;
  else if (numHab >= 3) pontos += 10;
  else if (numHab >= 1) pontos += 5;

  if (curriculo.linkedin) pontos += 8;
  if (curriculo.github) pontos += 7;

  return Math.min(pontos, 100);
}

export function buscarPorAderencia(
  curriculos: Curriculo[],
  termoBusca: string
): (Curriculo & { pontuacaoAderencia: number })[] {
  const termos = termoBusca
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  if (termos.length === 0) {
    return curriculos
      .map((c) => ({ ...c, pontuacaoAderencia: calcularPontuacao(c) }))
      .sort((a, b) => b.pontuacaoAderencia - a.pontuacaoAderencia);
  }

  const scored = curriculos.map((curriculo) => {
    let score = 0;

    const campos = [
      curriculo.cargo.toLowerCase(),
      curriculo.resumoProfissional.toLowerCase(),
      ...(curriculo.habilidades ?? []).map((h) => h.toLowerCase()),
      ...(curriculo.experiencias ?? []).map((e) =>
        `${e.cargo} ${e.empresa} ${e.descricao}`.toLowerCase()
      ),
      ...(curriculo.formacoes ?? []).map((f) =>
        `${f.curso} ${f.grau} ${f.instituicao}`.toLowerCase()
      ),
    ];

    for (const termo of termos) {
      for (const campo of campos) {
        if (campo.includes(termo)) score++;
      }
    }

    return { ...curriculo, pontuacaoAderencia: score };
  });

  return scored
    .filter((item) => item.pontuacaoAderencia > 0)
    .sort((a, b) => b.pontuacaoAderencia - a.pontuacaoAderencia);
}
