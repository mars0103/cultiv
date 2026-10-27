import { FloatingNav } from "@/components/nav/FloatingNav";
import { Hero } from "@/components/hero/Hero";
import { GoalsSection } from "@/components/goals/GoalsSection";
import { WhatsAppSection } from "@/components/whatsapp/WhatsAppSection";
import { LGPDSection } from "@/components/lgpd/LGPDSection";
import { FeedbacksSection } from "@/components/feedbacks/FeedbacksSection";
import { PlanoSection } from "@/components/pricing/PlanoSection";
import { FAQSection } from "@/components/faq/FAQSection";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <FloatingNav />
      <div id="como-funciona">
        <Hero />
      </div>
      <GoalsSection />
      <WhatsAppSection />
      <LGPDSection />
      <FeedbacksSection />
      <PlanoSection />
      <FAQSection />
    </main>
  );
}
