import { Hero } from "@/components/hero/Hero";
import { PlaceholderSection } from "@/components/sections/PlaceholderSection";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col overflow-x-hidden">
      <Hero />

      {/* TODO: transição com as notas + frase "organize seu dinheiro em 4 passos" (scroll-jack) */}
      {/* TODO: seção dos 4 passos (01-04) com troca de tela do celular + notificações no passo 03 */}

      <PlaceholderSection
        eyebrow="03"
        title="Tudo aparece automaticamente"
        subtitle="Ganhos, despesas, cartões - organizados sem você digitar nada."
      >
        <div className="mx-auto mt-10 h-[420px] max-w-sm rounded-[33px] bg-gray-200" />
      </PlaceholderSection>

      <PlaceholderSection title="Para sua comodidade, você também pode entender suas finanças, anotar gastos... tudo pelo whatsapp">
        <div className="mx-auto mt-10 h-[420px] max-w-sm rounded-[33px] bg-gray-200" />
      </PlaceholderSection>

      <PlaceholderSection title="Seus dados nunca ficam com a gente">
        <div className="mt-10 flex justify-center gap-16">
          <div className="h-[180px] w-[180px] rounded-full bg-gray-200" />
          <div className="h-[180px] w-[180px] rounded-full bg-gray-200" />
          <div className="h-[180px] w-[180px] rounded-full bg-gray-200" />
        </div>
      </PlaceholderSection>

      <PlaceholderSection title="Feedbacks">
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-[33px] bg-gray-200" />
          ))}
        </div>
      </PlaceholderSection>

      <PlaceholderSection title="Plano">
        <div className="mx-auto mt-10 h-[420px] max-w-lg rounded-[33px] bg-gray-200" />
      </PlaceholderSection>

      <PlaceholderSection title="Perguntas frequentes">
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[86px] rounded-[33px] bg-gray-200" />
          ))}
        </div>
      </PlaceholderSection>
    </main>
  );
}
