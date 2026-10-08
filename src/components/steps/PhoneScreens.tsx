"use client";

import Image from "next/image";

/** Shared reference box for every phone screen mockup (matches the Hero chat screen). */
const pct = (px: number, basis: number) => `${((px / basis) * 100).toFixed(2)}%`;
const X = (px: number) => pct(px, 389);
const Y = (px: number) => pct(px, 826);
const FSX = (px: number) => `${((px / 389) * 100).toFixed(2)}cqw`;

const inputFields = [
  { label: "NOME COMPLETO", placeholder: "Seu nome e sobrenome", top: 188, boxTop: 207, boxH: 38 },
  { label: "E-MAIL", placeholder: "seu@email.com", top: 263, boxTop: 282, boxH: 39 },
  { label: "DATA DE NASCIMENTO", placeholder: "DD/MM/AAAA", top: 338, boxTop: 358, boxH: 38 },
  { label: "SEXO", placeholder: "Selecione uma opção", top: 413, boxTop: 433, boxH: 38, dark: true },
  { label: "SENHA", placeholder: "Crie uma senha", top: 488, boxTop: 508, boxH: 38 },
  { label: "CONFIRMAR SENHA", placeholder: "Repita a senha", top: 563, boxTop: 583, boxH: 39 },
];

export function SignupScreen() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f4f6f5] [container-type:inline-size]">
      <p className="absolute font-display font-bold leading-none text-[#282828]" style={{ left: X(28), top: Y(70), fontSize: FSX(18) }}>
        Vamos começar!
      </p>
      <p className="absolute font-subtitle text-[#282828]" style={{ left: X(28), top: Y(96), fontSize: FSX(10) }}>
        Crie sua conta gratuitamente
      </p>

      <div className="absolute rounded-[10%] bg-[#d5f4e3]" style={{ left: X(28), top: Y(122), width: X(346), height: Y(41) }} />
      <div className="absolute rounded-full bg-[#25d366]" style={{ left: X(36), top: Y(128), width: X(30), height: Y(30) }}>
        <svg viewBox="0 0 24 24" fill="white" style={{ width: "60%", height: "60%", margin: "20% auto" }}>
          <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7 7 0 01-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.4a.4.4 0 000-.4c-.1-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a.9.9 0 00-.6.3 2.7 2.7 0 00-.8 2 4.8 4.8 0 001 2.5 10.7 10.7 0 004.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 001.5.1 2.5 2.5 0 001.6-1.1 2 2 0 00.1-1.1c-.1-.1-.2-.1-.4-.2z" />
        </svg>
      </div>
      <p className="absolute font-display font-medium text-[#282828]" style={{ left: X(74), top: Y(138), fontSize: FSX(10) }}>
        +55 (11) 98888-8888
      </p>
      <p className="absolute font-display font-semibold text-[#055928]" style={{ left: X(300), top: Y(138), fontSize: FSX(10) }}>
        Alterar
      </p>

      {inputFields.map((f) => (
        <div key={f.label}>
          <p
            className="absolute font-display font-light text-[#282828]"
            style={{ left: X(27), top: Y(f.top), fontSize: FSX(10) }}
          >
            {f.label}
          </p>
          <div
            className="absolute border border-[#cdcdcd] bg-white"
            style={{ left: X(27), top: Y(f.boxTop), width: X(340), height: Y(f.boxH), borderRadius: FSX(12) }}
          >
            <p
              className={`absolute inset-0 flex items-center px-[6%] font-display font-light ${f.dark ? "text-[#353131]" : "text-[#c9c9c9]"}`}
              style={{ fontSize: FSX(11) }}
            >
              {f.placeholder}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute rounded-[10%] bg-[#41e98c]" style={{ left: X(27), top: Y(704), width: X(346), height: Y(41) }}>
        <p className="absolute inset-0 flex items-center justify-center font-display font-medium text-[#282828]" style={{ fontSize: FSX(15) }}>
          Continuar
        </p>
      </div>
      <p className="absolute text-center font-display font-light" style={{ left: X(105), top: Y(756), width: X(180), fontSize: FSX(9.5) }}>
        <span className="text-[#c9c9c9]">Já tem uma conta? </span>
        <span className="font-medium text-[#00c853]">Entrar</span>
      </p>
    </div>
  );
}

export function OpenFinanceScreen() {
  // Nested cards need their OWN percentage basis (their own design width/
  // height), not the screen's — a percentage on an absolutely positioned
  // child resolves against its containing block (this card), so reusing the
  // screen-wide X()/Y() here was collapsing every child toward the card's
  // top-left corner instead of spreading across it.
  const secureBox = { w: 346, h: 52 };
  const Xs = (px: number) => pct(px, secureBox.w);
  const Ys = (px: number) => pct(px, secureBox.h);
  const emptyBox = { w: 340, h: 259 };
  const Xe = (px: number) => pct(px, emptyBox.w);
  const Ye = (px: number) => pct(px, emptyBox.h);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f4f6f5] [container-type:inline-size]">
      <p className="absolute flex items-center gap-1 font-display font-light text-[#282828]" style={{ left: X(27), top: Y(82), fontSize: FSX(10) }}>
        <span>‹</span> OPEN FINANCE
      </p>
      <div className="absolute flex items-center justify-center rounded-full bg-[#41e98c]" style={{ left: X(227), top: Y(78), width: X(147), height: Y(29) }}>
        <p className="font-display font-medium text-[#282828]" style={{ fontSize: FSX(10.5) }}>+ Conectar banco</p>
      </div>

      <div className="absolute rounded-[10%] border border-[#e6eeda] bg-[#f0f2ed]" style={{ left: X(28), top: Y(127), width: X(secureBox.w), height: Y(secureBox.h) }}>
        <div className="absolute flex items-center justify-center rounded-md border border-[#4ade80] bg-[#dce9df]" style={{ left: Xs(15), top: Ys(11), width: Xs(29), height: Ys(29) }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} style={{ width: "60%", height: "60%" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="absolute font-display font-medium text-[#282828]" style={{ left: Xs(53), top: Ys(14), fontSize: FSX(9) }}>Conexão segura</p>
        <p className="absolute font-subtitle text-[#797979]" style={{ left: Xs(53), top: Ys(28), fontSize: FSX(7.8) }}>Seus dados são protegidos e nunca compartilhados</p>
      </div>

      <div className="absolute rounded-[10%] border border-[#cdcdcd] bg-white" style={{ left: X(27), top: Y(207), width: X(emptyBox.w), height: Y(emptyBox.h) }}>
        <div className="absolute rounded-lg border border-[#d4d2ca] bg-[#ebeae5]" style={{ left: Xe(144), top: Ye(35), width: Xe(53), height: Ye(53) }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth={1.5} className="absolute inset-0 m-auto" style={{ width: "55%", height: "55%" }}>
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M3 10h18M8 14h1" />
          </svg>
        </div>
        <p className="absolute -translate-x-1/2 text-center font-display font-semibold text-[#191919]" style={{ left: "50%", top: Ye(106), width: Xe(269), fontSize: FSX(14.4) }}>
          Nenhum banco conectado
        </p>
        <p className="absolute -translate-x-1/2 text-center font-subtitle text-[#191919]" style={{ left: "50%", top: Ye(132), width: Xe(245), fontSize: FSX(11) }}>
          Conecte sua conta para importar transações automaticamente.
        </p>
        <div className="absolute flex items-center justify-center rounded-[10px] bg-[#41e98c]" style={{ left: Xe(25), top: Ye(195), width: Xe(296), height: Ye(41) }}>
          <p className="font-display font-medium text-[#282828]" style={{ fontSize: FSX(15) }}>+ Conectar primeiro banco</p>
        </div>
      </div>
    </div>
  );
}

function CultivMark({ width }: { width: string }) {
  return (
    <div className="relative rounded-[20%] bg-[#242424]" style={{ width, aspectRatio: "1 / 1" }}>
      <Image src="/images/brand/logo-icon.svg" alt="" fill className="object-contain p-[18%]" />
    </div>
  );
}

export function HomeScreen() {
  // Same nested-basis issue as OpenFinanceScreen: each card needs its own
  // local percentage basis, not the screen's, or its children collapse
  // toward its top-left corner.
  const spentBox = { w: 329, h: 245 };
  const Xp = (px: number) => pct(px, spentBox.w);
  const Yp = (px: number) => pct(px, spentBox.h);
  const balanceBox = { w: 329, h: 230 };
  const Xb = (px: number) => pct(px, balanceBox.w);
  const Yb = (px: number) => pct(px, balanceBox.h);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#0c3c2c] via-[52%] via-[#0aa85c] to-[#f1f5f4] [container-type:inline-size]">
      <div className="absolute" style={{ left: X(27), top: Y(60), width: X(30), height: FSX(35) }}>
        <Image src="/images/brand/logo clara.svg" alt="Cultiv" fill className="object-contain object-left" />
      </div>
      <p className="absolute font-display font-light text-white" style={{ left: X(27), top: Y(78), fontSize: FSX(13.5) }}>Boa tarde,</p>
      <p className="absolute font-display font-bold text-white" style={{ left: X(27), top: Y(94), fontSize: FSX(17.5) }}>Matheus</p>

      <div className="absolute flex items-center justify-between rounded-full bg-[#0b3b2b] px-[8%] shadow-sm" style={{ left: X(234), top: Y(77.5), width: X(125), height: Y(35) }}>
        <span className="text-white" style={{ fontSize: FSX(9) }}>‹</span>
        <p className="font-display text-white" style={{ fontSize: FSX(10.8) }}>Set 2026</p>
        <span className="text-white" style={{ fontSize: FSX(9) }}>›</span>
      </div>

      <div className="absolute overflow-hidden rounded-[7%] bg-[#cbe0d7]" style={{ left: X(30), top: Y(158), width: X(spentBox.w), height: Y(spentBox.h) }}>
        <p className="absolute font-display font-medium text-[#6d6d6d]" style={{ left: Xp(20), top: Yp(15), fontSize: FSX(8.3) }}>SOBROU EM SETEMBRO</p>
        <p className="absolute font-display font-medium text-[#202020]" style={{ left: Xp(20), top: Yp(38), fontSize: FSX(36.7) }}>
          R$ 0<span className="text-[#a4a4a4]" style={{ fontSize: FSX(21) }}>,00</span>
        </p>
        <p className="absolute font-display font-medium text-[#505050]" style={{ left: Xp(30), top: Yp(139), fontSize: FSX(10) }}>Entrou</p>
        <p className="absolute font-display font-medium text-[#505050]" style={{ left: Xp(164), top: Yp(139), fontSize: FSX(10) }}>Saiu</p>
        <p className="absolute font-display font-medium text-[#202020]" style={{ left: Xp(20), top: Yp(157), fontSize: FSX(12.8) }}>R$ 0,00</p>
        <p className="absolute font-display font-medium text-[#202020]" style={{ left: Xp(153), top: Yp(157), fontSize: FSX(12.8) }}>R$ 0,00</p>
        <div className="absolute rounded-full bg-[#11b565]" style={{ left: Xp(21), top: Yp(119), width: Xp(132), height: Yp(7.6) }} />
        <div className="absolute rounded-full bg-[#ee4f40]" style={{ left: Xp(155), top: Yp(119), width: Xp(132), height: Yp(7.6) }} />
        <div className="absolute overflow-hidden rounded-full bg-white" style={{ left: Xp(21), top: Yp(186), width: Xp(268), height: Yp(31) }}>
          <p className="absolute inset-0 flex items-center justify-center font-display font-medium text-[#202020]" style={{ fontSize: FSX(10) }}>
            Ritmo de R$ ,00/dia · dia 14 de 30
          </p>
        </div>
      </div>

      <div className="absolute overflow-hidden rounded-[7%] bg-[#cbe0d7]" style={{ left: X(30), top: Y(427), width: X(balanceBox.w), height: Y(balanceBox.h) }}>
        <p className="absolute font-display font-medium text-[#6d6d6d]" style={{ left: Xb(20), top: Yb(15), fontSize: FSX(8.3) }}>SALDO EM CONTAS</p>
        <p className="absolute font-display font-medium text-[#202020]" style={{ left: Xb(20), top: Yb(38), fontSize: FSX(36.7) }}>
          R$ 0<span className="text-[#a4a4a4]" style={{ fontSize: FSX(21) }}>,00</span>
        </p>
        <div className="absolute bg-[#b7c9c0]" style={{ left: Xb(22), top: Yb(98), width: Xb(292), height: 1 }} />
        <div className="absolute bg-[#b7c9c0]" style={{ left: Xb(22), top: Yb(165), width: Xb(292), height: 1 }} />
        <div className="absolute" style={{ left: Xb(22), top: Yb(114) }}>
          <CultivMark width={Xb(35)} />
        </div>
        <p className="absolute font-display font-medium text-[#202020]" style={{ left: Xb(65), top: Yb(122), fontSize: FSX(10) }}>Conta Cultiv</p>
        <p className="absolute font-display font-light text-[#202020]" style={{ left: Xb(65), top: Yb(133), fontSize: FSX(7.2) }}>Dinheiro vivo</p>
        <p className="absolute font-display font-medium text-[#202020]" style={{ left: Xb(270), top: Yb(124), fontSize: FSX(10) }}>0,00</p>
        <p className="absolute font-display font-light text-[#202020]" style={{ left: Xb(26), top: Yb(192), fontSize: FSX(9.7) }}>+ Conectar banco</p>
        <p className="absolute font-display font-medium text-[#0d793a]" style={{ left: Xb(249), top: Yb(193), fontSize: FSX(8.5) }}>Ver contas ›</p>
      </div>
    </div>
  );
}
