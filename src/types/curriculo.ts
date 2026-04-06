export interface ExperienciaProfissional {
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
}

export interface FormacaoAcademica {
  instituicao: string;
  curso: string;
  grau: string;
  dataInicio: string;
  dataFim: string;
}

export interface Curriculo {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  resumoProfissional: string;
  linkedin?: string;
  github?: string;
  foto?: string;
  experiencias: ExperienciaProfissional[];
  formacoes: FormacaoAcademica[];
  habilidades: string[];
}
