# CurrículoPro — Sistema de Gestão de Currículos

Aplicação web desenvolvida como trabalho acadêmico (Etapa 2 — Backend e Firebase).

## Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework principal |
| **Tailwind CSS v4** | Estilização |
| **shadcn/ui** | Componentes de UI |
| **React Hook Form + Yup** | Formulários e validação |
| **Sonner** | Notificações toast |
| **Firebase Firestore** | Banco de dados em nuvem |
| **React Icons** | Ícones |

## Como rodar

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
# Crie o arquivo .env.local na raiz com as chaves do seu projeto Firebase:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Landing page |
| `/curriculos/visualizar` | Lista de currículos com busca por nome/cargo e busca por aderência |
| `/curriculos/visualizar/[id]` | Detalhes do currículo + diagnóstico de qualidade |
| `/curriculos/visualizar/[id]/editar` | Formulário de edição pré-preenchido |
| `/curriculos/cadastrar` | Formulário de cadastro |

## Arquitetura do projeto

```
src/
├── app/
│   ├── curriculos/
│   │   ├── visualizar/
│   │   │   ├── page.tsx          # Lista + busca por nome/cargo + busca por aderência
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Detalhes + diagnóstico + exclusão com confirmação
│   │   │       └── editar/
│   │   │           └── page.tsx  # Edição (pré-preenche form com dados do Firestore)
│   │   └── cadastrar/
│   │       └── page.tsx          # Cadastro (wrapper fino do FormCurriculo)
│   ├── layout.tsx
│   └── page.tsx                  # Home / Landing page
│
├── components/
│   ├── FormCurriculo.tsx         # Formulário completo (compartilhado entre criar e editar)
│   ├── CardCurriculo.tsx         # Card individual de currículo
│   ├── ListaCurriculos.tsx       # Grid de cards
│   ├── SugestoesCurriculo.tsx    # Diagnóstico de qualidade e pontuação
│   ├── layout/                   # Header, Footer, Nav
│   └── ui/                       # Componentes shadcn/ui
│
├── lib/
│   ├── firebase.ts               # Inicialização do Firebase (lê .env.local)
│   └── curriculoService.ts       # CRUD completo no Firestore
│
├── utils/
│   └── sugestoesCurriculo.ts     # Lógica de sugestões, pontuação e busca por aderência
│
└── types/
    └── curriculo.ts              # Interfaces TypeScript (Curriculo, Experiencia, Formacao)
```

## Integração com Firebase

A configuração segue o padrão recomendado:

1. **`lib/firebase.ts`** — inicializa o app com `initializeApp` (evitando re-inicialização com `getApps()`), exporta a instância `db` do Firestore.

2. **`.env.local`** — todas as chaves do projeto ficam em variáveis de ambiente prefixadas com `NEXT_PUBLIC_`, mantendo-as fora do código-fonte.

3. **`lib/curriculoService.ts`** — service isolado que centraliza toda comunicação com o Firestore:

| Função | Operação |
|---|---|
| `getCurriculos()` | Lista todos, ordenados por nome |
| `getCurriculoById(id)` | Busca por ID do documento |
| `saveCurriculo(data)` | Adiciona novo documento com `serverTimestamp()` |
| `updateCurriculo(id, data)` | Atualiza documento existente com `updatedAt` |
| `deleteCurriculo(id)` | Remove o documento |
| `pesquisarCurriculosPorNome(nome)` | Query com `where` + `` range |
| `pesquisarCurriculosPorCargo(cargo)` | Query com `where` + `` range |

Os campos `createdAt` e `updatedAt` são gerenciados pelo servidor via `serverTimestamp()`, garantindo consistência independente do fuso horário do cliente.

## Feature: Sugestão de currículos

Implementada em `utils/sugestoesCurriculo.ts` e consumida por `SugestoesCurriculo.tsx` e pela página de listagem.

### Diagnóstico individual (`gerarSugestoes`)

Ao abrir um currículo, o sistema avalia automaticamente:

| Regra | Tipo |
|---|---|
| Resumo profissional com menos de 100 caracteres | Aviso |
| Nenhuma experiência profissional | Erro |
| Nenhuma formação acadêmica | Erro |
| Menos de 3 habilidades cadastradas | Aviso |
| E-mail com formato inválido | Erro |
| Telefone com formato inválido | Erro |
| Cargo incompatível com as habilidades (ex: "frontend" sem React/HTML/CSS) | Aviso |

Cada currículo recebe também uma **pontuação de completude de 0 a 100** (`calcularPontuacao`), calculada com base na riqueza do resumo, número de experiências, formações, habilidades e presença de LinkedIn/GitHub.

### Busca por aderência (`buscarPorAderencia`)

Na página de listagem há um campo "Busca por aderência". O usuário digita habilidades, cargo ou formação desejados (ex: `React TypeScript Node.js`). A função:

1. Divide o texto em termos individuais.
2. Busca cada termo nos campos `cargo`, `resumo`, `habilidades`, `experiencias` e `formacoes` de cada currículo.
3. Atribui uma pontuação de aderência por número de matches.
4. Retorna os currículos ordenados do maior para o menor score, destacando o primeiro resultado.

Se nenhum termo for digitado, os currículos são exibidos ordenados pela pontuação de completude.

## Grupo

- **Guilherme (Aniel)** — Setup, layout global, Home page, estrutura inicial, integração Firebase, CRUD completo, feature de sugestões, edição, confirmação de exclusão
- **Gabriel** — Lista de currículos, busca em tempo real, skeletons, empty states
- **Gustavo** — Formulário de cadastro, validações, máscaras, página de detalhes
