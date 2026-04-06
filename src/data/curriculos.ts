import { Curriculo } from "@/types/curriculo";

export const curriculosMock: Curriculo[] = [
  {
    id: "1",
    nome: "Ana Clara Mendes",
    cargo: "Desenvolvedora Frontend",
    email: "ana.mendes@email.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    dataNascimento: "15/03/1998",
    resumoProfissional:
      "Desenvolvedora Frontend com 4 anos de experiência em React, Next.js e TypeScript. Apaixonada por UX e interfaces acessíveis.",
    linkedin: "linkedin.com/in/anaclara",
    github: "github.com/anaclara",
    foto: "/avatars/ana.jpg",
    experiencias: [
      {
        empresa: "TechSolve Ltda",
        cargo: "Desenvolvedora Frontend Plena",
        dataInicio: "01/2022",
        dataFim: "Atual",
        descricao:
          "Desenvolvimento de interfaces com React e Next.js, integração com APIs REST e manutenção de design system.",
      },
      {
        empresa: "StartupXYZ",
        cargo: "Desenvolvedora Frontend Júnior",
        dataInicio: "06/2020",
        dataFim: "12/2021",
        descricao:
          "Criação de landing pages e dashboards responsivos com HTML, CSS e JavaScript.",
      },
    ],
    formacoes: [
      {
        instituicao: "Universidade Federal de São Paulo",
        curso: "Sistemas de Informação",
        grau: "Bacharelado",
        dataInicio: "2016",
        dataFim: "2020",
      },
    ],
    habilidades: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    id: "2",
    nome: "Bruno Ferreira Lima",
    cargo: "Engenheiro de Software Backend",
    email: "bruno.lima@email.com",
    telefone: "(21) 97654-3210",
    cpf: "987.654.321-00",
    dataNascimento: "22/07/1995",
    resumoProfissional:
      "Engenheiro Backend com expertise em Node.js, PostgreSQL e arquitetura de microsserviços. 6 anos de experiência em sistemas escaláveis.",
    linkedin: "linkedin.com/in/brunolima",
    github: "github.com/brunolima",
    foto: "/avatars/bruno.jpg",
    experiencias: [
      {
        empresa: "FinBank S.A.",
        cargo: "Engenheiro de Software Sênior",
        dataInicio: "03/2021",
        dataFim: "Atual",
        descricao:
          "Arquitetura e desenvolvimento de APIs RESTful e microsserviços para sistema financeiro com alta disponibilidade.",
      },
    ],
    formacoes: [
      {
        instituicao: "Universidade Estadual do Rio de Janeiro",
        curso: "Ciência da Computação",
        grau: "Bacharelado",
        dataInicio: "2013",
        dataFim: "2017",
      },
      {
        instituicao: "PUC-Rio",
        curso: "Engenharia de Software",
        grau: "Pós-graduação",
        dataInicio: "2018",
        dataFim: "2019",
      },
    ],
    habilidades: ["Node.js", "PostgreSQL", "Docker", "AWS", "TypeScript"],
  },
  {
    id: "3",
    nome: "Carla Rodrigues Santos",
    cargo: "UX/UI Designer",
    email: "carla.santos@email.com",
    telefone: "(31) 96543-2109",
    cpf: "111.222.333-44",
    dataNascimento: "08/11/1999",
    resumoProfissional:
      "Designer UX/UI com foco em pesquisa com usuário e design centrado em pessoas. Experiência em produtos digitais B2C e B2B.",
    linkedin: "linkedin.com/in/carlasantos",
    foto: "/avatars/carla.jpg",
    experiencias: [
      {
        empresa: "Agência Criativa Digital",
        cargo: "UX/UI Designer Plena",
        dataInicio: "05/2022",
        dataFim: "Atual",
        descricao:
          "Design de interfaces para aplicativos móveis e web, condução de testes de usabilidade e prototipação no Figma.",
      },
    ],
    formacoes: [
      {
        instituicao: "UFMG",
        curso: "Design Gráfico",
        grau: "Bacharelado",
        dataInicio: "2017",
        dataFim: "2021",
      },
    ],
    habilidades: ["Figma", "Adobe XD", "Illustrator", "Pesquisa UX", "Prototyping"],
  },
];
