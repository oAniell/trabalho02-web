import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FiFileText,
  FiSearch,
  FiShield,
  FiZap,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const features = [
  {
    icon: FiFileText,
    title: "Cadastro Completo",
    description:
      "Registre todas as informações do candidato: dados pessoais, experiências, formação e habilidades em um único lugar.",
  },
  {
    icon: FiSearch,
    title: "Busca Inteligente",
    description:
      "Encontre currículos instantaneamente filtrando por nome ou cargo com busca em tempo real.",
  },
  {
    icon: FiShield,
    title: "Dados Seguros",
    description:
      "Suas informações ficam armazenadas de forma segura e organizada, sempre disponíveis quando precisar.",
  },
  {
    icon: FiZap,
    title: "Interface Ágil",
    description:
      "Navegação fluida e responsiva para desktop, tablet e mobile com feedback visual imediato.",
  },
  {
    icon: FiUsers,
    title: "Gestão de Talentos",
    description:
      "Gerencie múltiplos currículos de candidatos de forma centralizada e eficiente.",
  },
];

const benefits = [
  "Formulário com validação em tempo real",
  "Campos dinâmicos para experiências e formações",
  "Máscaras automáticas em CPF, telefone e datas",
  "Notificações de sucesso e erro",
  "Layout responsivo para qualquer dispositivo",
  "Busca e filtros instantâneos",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-violet-700 via-purple-600 to-fuchsia-600 text-white py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
            Sistema de Gestão de Currículos
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Gerencie talentos com{" "}
            <span className="text-violet-200">eficiência e estilo</span>
          </h1>
          <p className="text-lg sm:text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
            Uma plataforma moderna para cadastrar, visualizar e gerenciar
            currículos profissionais de forma simples e rápida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-700 hover:bg-violet-50 font-semibold"
            >
              <Link href="/curriculos/visualizar">
                <FiFileText className="mr-2" />
                Ver Currículos
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white/10"
            >
              <Link href="/curriculos/cadastrar">
                Cadastrar Novo
                <FiArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-violet-50 [clip-path:ellipse(55%_100%_at_50%_100%)]" />
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-violet-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-violet-900 mb-3">
              Tudo que você precisa
            </h2>
            <p className="text-violet-600 max-w-xl mx-auto">
              Ferramentas pensadas para tornar o processo de gestão de currículos
              mais ágil e organizado.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-3">
                    <Icon className="text-violet-600" size={20} />
                  </div>
                  <CardTitle className="text-base font-semibold text-violet-900">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-violet-600 leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-violet-900 mb-4">
                Por que usar o CurrículoPro?
              </h2>
              <p className="text-violet-600 mb-8 leading-relaxed">
                Desenvolvido com as melhores tecnologias do mercado para
                garantir uma experiência fluida, segura e eficiente no
                gerenciamento de candidatos.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-violet-700">
                    <FiCheckCircle className="text-violet-500 shrink-0" size={18} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <Card className="border-violet-100 bg-violet-50/50 shadow-none">
                <CardContent className="pt-6">
                  <p className="text-sm text-violet-700 font-medium mb-1">Currículos cadastrados</p>
                  <p className="text-4xl font-extrabold text-violet-700">3+</p>
                  <p className="text-xs text-violet-500 mt-1">Prontos para demonstração</p>
                </CardContent>
              </Card>
              <Card className="border-fuchsia-100 bg-fuchsia-50/50 shadow-none">
                <CardContent className="pt-6">
                  <p className="text-sm text-fuchsia-700 font-medium mb-1">Campos validados</p>
                  <p className="text-4xl font-extrabold text-fuchsia-700">100%</p>
                  <p className="text-xs text-fuchsia-500 mt-1">Via React Hook Form + Yup</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-violet-200 mb-8">
            Explore os currículos já cadastrados ou adicione um novo agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50 font-semibold"
            >
              <Link href="/curriculos/visualizar">Explorar Currículos</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white/10"
            >
              <Link href="/curriculos/cadastrar">Novo Cadastro</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
