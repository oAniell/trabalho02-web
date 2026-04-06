# CurrículoPro — Sistema de Gestão de Currículos

Aplicação web desenvolvida como trabalho acadêmico (Etapa 1 — Frontend).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS v4
- **UI Library:** shadcn/ui
- **Formulários:** React Hook Form + Yup
- **Máscaras:** React Input Mask
- **Feedback:** Sonner (toast notifications)
- **Ícones:** React Icons

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/curriculos/visualizar` | Lista de currículos |
| `/curriculos/visualizar/[id]` | Detalhes do currículo |
| `/curriculos/cadastrar` | Formulário de cadastro |

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
src/
├── app/
│   ├── curriculos/
│   │   ├── visualizar/         # Lista (Gabriel)
│   │   │   └── [id]/           # Detalhes (Gustavo)
│   │   └── cadastrar/          # Formulário (Gustavo)
│   ├── layout.tsx              # Layout global
│   └── page.tsx                # Home
├── components/
│   ├── layout/                 # Header, Footer, Nav
│   └── ui/                     # shadcn components
├── data/
│   └── curriculos.ts           # Mock data
├── lib/
│   └── storage.ts              # Utilitário localStorage
├── types/
│   └── curriculo.ts            # Interfaces TypeScript
└── middleware.ts               # Redirecionamento de rotas
```

## Grupo

- **Aniel** — Setup, layout global, Home page, mock data
- **Gabriel** — Lista de currículos, busca em tempo real, empty state, skeleton
- **Gustavo** — Formulário de cadastro (React Hook Form + Yup + useFieldArray), detalhes do currículo
