"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FieldErrors, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import {
  FiBriefcase,
  FiCalendar,
  FiGithub,
  FiImage,
  FiLinkedin,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveCurriculo } from "@/lib/curriculoService";
import { Curriculo } from "@/types/curriculo";

type CurriculoFormData = Omit<Curriculo, "id">;

const experienciaSchema = yup.object({
  empresa: yup.string().trim().required("Informe a empresa."),
  cargo: yup.string().trim().required("Informe o cargo da experiencia."),
  dataInicio: yup
    .string()
    .trim()
    .required("Informe o inicio da experiencia.")
    .matches(/^\d{2}\/\d{4}$/, "Use o formato MM/AAAA no inicio da experiencia."),
  dataFim: yup
    .string()
    .trim()
    .required("Informe o fim da experiencia.")
    .matches(/^\d{2}\/\d{4}$/, "Use o formato MM/AAAA no fim da experiencia."),
  descricao: yup.string().trim().required("Descreva a experiencia."),
});

const formacaoSchema = yup.object({
  instituicao: yup.string().trim().required("Informe a instituicao."),
  curso: yup.string().trim().required("Informe o curso."),
  grau: yup.string().trim().required("Informe o grau."),
  dataInicio: yup
    .string()
    .trim()
    .required("Informe o inicio da formacao.")
    .matches(/^\d{2}\/\d{4}$/, "Use o formato MM/AAAA no inicio da formacao."),
  dataFim: yup
    .string()
    .trim()
    .required("Informe o fim da formacao.")
    .matches(/^\d{2}\/\d{4}$/, "Use o formato MM/AAAA no fim da formacao."),
});

const schema: yup.ObjectSchema<CurriculoFormData> = yup.object({
  nome: yup.string().trim().min(3, "Nome completo deve ter no minimo 3 caracteres.").required("Informe o nome completo."),
  cargo: yup.string().trim().min(2, "Cargo pretendido deve ter no minimo 2 caracteres.").required("Informe o cargo pretendido."),
  email: yup.string().trim().email("Informe um e-mail valido.").required("Informe o e-mail."),
  telefone: yup
    .string()
    .required("Informe o telefone.")
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Use o formato (11) 98765-4321 no telefone."),
  cpf: yup
    .string()
    .required("Informe o CPF.")
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Use o formato 123.456.789-00 no CPF."),
  dataNascimento: yup
    .string()
    .required("Informe a data de nascimento.")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA na data de nascimento."),
  resumoProfissional: yup
    .string()
    .trim()
    .min(20, "Resumo profissional deve ter no minimo 20 caracteres.")
    .required("Informe o resumo profissional."),
  linkedin: yup.string().trim().optional(),
  github: yup.string().trim().optional(),
  foto: yup.string().optional(),
  experiencias: yup.array().of(experienciaSchema).min(1, "Adicione pelo menos uma experiencia.").required(),
  formacoes: yup.array().of(formacaoSchema).min(1, "Adicione pelo menos uma formacao.").required(),
  habilidades: yup.array().of(yup.string().required()).required(),
});

const emptyExperience = {
  empresa: "",
  cargo: "",
  dataInicio: "",
  dataFim: "",
  descricao: "",
};

const emptyEducation = {
  instituicao: "",
  curso: "",
  grau: "",
  dataInicio: "",
  dataFim: "",
};

const PHOTO_PREVIEWS_KEY = "curriculoFotoPreviews";

function savePhotoPreview(fileName: string, dataUrl: string) {
  const stored = localStorage.getItem(PHOTO_PREVIEWS_KEY);
  const previews = stored ? (JSON.parse(stored) as Record<string, string>) : {};

  localStorage.setItem(
    PHOTO_PREVIEWS_KEY,
    JSON.stringify({
      ...previews,
      [fileName]: dataUrl,
    })
  );
}

function applyMask(value: string, pattern: string) {
  const maxDigits = (pattern.match(/9/g) ?? []).length;
  const digits = value.replace(/\D/g, "").slice(0, maxDigits);
  let output = "";
  let digitIndex = 0;

  for (const char of pattern) {
    if (char === "9") {
      if (digitIndex >= digits.length) break;
      output += digits[digitIndex];
      digitIndex += 1;
      continue;
    }

    if (digits.length > 0 && digitIndex <= digits.length) {
      output += char;
    }
  }

  return output;
}

function getFirstErrorMessage(errors: FieldErrors<CurriculoFormData>): string | undefined {
  for (const value of Object.values(errors)) {
    if (!value) continue;
    if ("message" in value && typeof value.message === "string") return value.message;
    if (Array.isArray(value)) {
      for (const item of value) {
        const nested = getFirstErrorMessage(item as FieldErrors<CurriculoFormData>);
        if (nested) return nested;
      }
    } else if (typeof value === "object") {
      const nested = getFirstErrorMessage(value as FieldErrors<CurriculoFormData>);
      if (nested) return nested;
    }
  }
}

export default function CadastrarPage() {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CurriculoFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      cargo: "",
      email: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
      resumoProfissional: "",
      linkedin: "",
      github: "",
      foto: "",
      experiencias: [emptyExperience],
      formacoes: [emptyEducation],
      habilidades: [],
    },
  });

  const habilidades = useWatch({ control, name: "habilidades" }) ?? [];

  const experiencias = useFieldArray({
    control,
    name: "experiencias",
  });

  const formacoes = useFieldArray({
    control,
    name: "formacoes",
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setValue("foto", "", { shouldDirty: true, shouldValidate: true });
      setPreviewUrl(null);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setValue("foto", file.name, { shouldDirty: true, shouldValidate: true });

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        savePhotoPreview(file.name, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || habilidades.includes(skill)) return;

    setValue("habilidades", [...habilidades, skill], { shouldDirty: true, shouldValidate: true });
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setValue(
      "habilidades",
      habilidades.filter((item) => item !== skill),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const onSubmit = async (data: CurriculoFormData) => {
    try {
      await saveCurriculo(data);
      toast.success("Currículo cadastrado com sucesso!");
      router.push("/curriculos/visualizar");
    } catch (err) {
      console.error("Erro ao cadastrar currículo:", err);
      toast.error("Erro ao cadastrar currículo. Tente novamente.");
    }
  };

  const onInvalid = (formErrors: FieldErrors<CurriculoFormData>) => {
    toast.error(getFirstErrorMessage(formErrors) ?? "Revise os campos obrigatorios.");
  };

  return (
    <div className="min-h-screen bg-violet-50 py-8">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-violet-600">Cadastro de curriculo</p>
          <h1 className="text-3xl font-bold text-violet-950">Novo curriculo</h1>
          <p className="max-w-2xl text-sm text-violet-700">
            Preencha seus dados profissionais para criar um curriculo completo.
          </p>
        </div>

        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-950">
              <FiUser className="text-violet-600" />
              Dados pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Nome completo" error={errors.nome?.message}>
              <Input {...register("nome")} placeholder="Seu nome completo" aria-invalid={!!errors.nome} />
            </Field>

            <Field label="Cargo pretendido" error={errors.cargo?.message}>
              <Input {...register("cargo")} placeholder="Ex: Desenvolvedor Frontend" aria-invalid={!!errors.cargo} />
            </Field>

            <Field label="E-mail" error={errors.email?.message}>
              <Input {...register("email")} type="email" placeholder="voce@email.com" aria-invalid={!!errors.email} />
            </Field>

            <MaskedField
              control={control}
              name="telefone"
              label="Telefone"
              mask="(99) 99999-9999"
              placeholder="(11) 98765-4321"
              error={errors.telefone?.message}
            />

            <MaskedField
              control={control}
              name="cpf"
              label="CPF"
              mask="999.999.999-99"
              placeholder="123.456.789-00"
              error={errors.cpf?.message}
            />

            <MaskedField
              control={control}
              name="dataNascimento"
              label="Data de nascimento"
              mask="99/99/9999"
              placeholder="15/03/1990"
              error={errors.dataNascimento?.message}
            />

            <Field label="LinkedIn" error={errors.linkedin?.message}>
              <div className="relative">
                <FiLinkedin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
                <Input {...register("linkedin")} className="pl-9" placeholder="linkedin.com/in/seu-perfil" />
              </div>
            </Field>

            <Field label="GitHub" error={errors.github?.message}>
              <div className="relative">
                <FiGithub className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
                <Input {...register("github")} className="pl-9" placeholder="github.com/seu-usuario" />
              </div>
            </Field>

            <Field label="Resumo profissional" error={errors.resumoProfissional?.message} className="md:col-span-2">
              <Textarea
                {...register("resumoProfissional")}
                rows={5}
                placeholder="Conte brevemente sobre sua experiencia, objetivos e principais competencias."
                aria-invalid={!!errors.resumoProfissional}
              />
            </Field>

            <div className="grid gap-3 md:col-span-2 md:grid-cols-[220px_1fr] md:items-center">
              <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-violet-200 bg-violet-50">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview da foto" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-violet-600">
                    <FiImage className="h-8 w-8" />
                    <span className="text-sm font-medium">Preview da foto</span>
                  </div>
                )}
              </div>
              <Field label="Foto" error={errors.foto?.message}>
                <Input type="file" accept="image/*" onChange={handlePhotoChange} className="bg-white" />
                <p className="text-xs text-violet-500">O arquivo nao sera enviado; apenas o nome sera salvo.</p>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-violet-950">
              <FiBriefcase className="text-violet-600" />
              Experiencias profissionais
            </CardTitle>
            <Button
              type="button"
              onClick={() => experiencias.append(emptyExperience)}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              <FiPlus />
              Adicionar Experiencia
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {experiencias.fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 rounded-lg border border-violet-100 p-4 md:grid-cols-2">
                <Field label="Empresa" error={errors.experiencias?.[index]?.empresa?.message}>
                  <Input {...register(`experiencias.${index}.empresa`)} aria-invalid={!!errors.experiencias?.[index]?.empresa} />
                </Field>
                <Field label="Cargo" error={errors.experiencias?.[index]?.cargo?.message}>
                  <Input {...register(`experiencias.${index}.cargo`)} aria-invalid={!!errors.experiencias?.[index]?.cargo} />
                </Field>
                <MaskedField
                  control={control}
                  name={`experiencias.${index}.dataInicio`}
                  label="Data de inicio"
                  mask="99/9999"
                  placeholder="01/2022"
                  error={errors.experiencias?.[index]?.dataInicio?.message}
                />
                <MaskedField
                  control={control}
                  name={`experiencias.${index}.dataFim`}
                  label="Data de fim"
                  mask="99/9999"
                  placeholder="12/2024"
                  error={errors.experiencias?.[index]?.dataFim?.message}
                />
                <Field label="Descricao" error={errors.experiencias?.[index]?.descricao?.message} className="md:col-span-2">
                  <Textarea {...register(`experiencias.${index}.descricao`)} rows={4} aria-invalid={!!errors.experiencias?.[index]?.descricao} />
                </Field>
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => experiencias.remove(index)}
                    disabled={experiencias.fields.length === 1}
                    className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <FiTrash2 />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-violet-950">
              <FiCalendar className="text-violet-600" />
              Formacao academica
            </CardTitle>
            <Button
              type="button"
              onClick={() => formacoes.append(emptyEducation)}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              <FiPlus />
              Adicionar Formacao
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {formacoes.fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 rounded-lg border border-violet-100 p-4 md:grid-cols-2">
                <Field label="Instituicao" error={errors.formacoes?.[index]?.instituicao?.message}>
                  <Input {...register(`formacoes.${index}.instituicao`)} aria-invalid={!!errors.formacoes?.[index]?.instituicao} />
                </Field>
                <Field label="Curso" error={errors.formacoes?.[index]?.curso?.message}>
                  <Input {...register(`formacoes.${index}.curso`)} aria-invalid={!!errors.formacoes?.[index]?.curso} />
                </Field>
                <Field label="Grau" error={errors.formacoes?.[index]?.grau?.message}>
                  <Input {...register(`formacoes.${index}.grau`)} placeholder="Bacharelado, Tecnologo, Pos-graduacao..." aria-invalid={!!errors.formacoes?.[index]?.grau} />
                </Field>
                <MaskedField
                  control={control}
                  name={`formacoes.${index}.dataInicio`}
                  label="Data de inicio"
                  mask="99/9999"
                  placeholder="02/2018"
                  error={errors.formacoes?.[index]?.dataInicio?.message}
                />
                <MaskedField
                  control={control}
                  name={`formacoes.${index}.dataFim`}
                  label="Data de fim"
                  mask="99/9999"
                  placeholder="12/2022"
                  error={errors.formacoes?.[index]?.dataFim?.message}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => formacoes.remove(index)}
                    disabled={formacoes.fields.length === 1}
                    className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <FiTrash2 />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-violet-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-violet-950">Habilidades</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Ex: React"
              />
              <Button type="button" onClick={addSkill} className="bg-violet-600 text-white hover:bg-violet-700">
                <FiPlus />
                Adicionar
              </Button>
            </div>
            <div className="flex min-h-8 flex-wrap gap-2">
              {habilidades.map((skill) => (
                <Badge key={skill} className="bg-violet-100 text-violet-700">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remover ${skill}`}>
                    <FiX />
                  </button>
                </Badge>
              ))}
              {habilidades.length === 0 && <p className="text-sm text-violet-500">Nenhuma habilidade adicionada.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="h-10 bg-violet-600 px-6 text-white hover:bg-violet-700"
          >
            <FiSave />
            {isSubmitting ? "Salvando..." : "Salvar curriculo"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function MaskedField({
  control,
  name,
  label,
  mask,
  placeholder,
  error,
}: {
  control: ReturnType<typeof useForm<CurriculoFormData>>["control"];
  name: Parameters<typeof Controller<CurriculoFormData>>[0]["name"];
  label: string;
  mask: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            value={String(field.value ?? "")}
            placeholder={placeholder}
            aria-invalid={!!error}
            onChange={(event) => field.onChange(applyMask(event.target.value, mask))}
          />
        )}
      />
    </Field>
  );
}
