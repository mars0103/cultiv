import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionProvider } from "@/components/decor/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cultiv — Sua vida financeira muito mais organizada",
  description:
    "Conecte seu banco e deixe a Cultiv organizar seu mundo financeiro automaticamente.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
