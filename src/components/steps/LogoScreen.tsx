import Image from "next/image";

/** The Steps section's phone never shows app UI — per Figma it just displays
 * the Cultiv wordmark centered on a soft cream gradient, for every step. */
export function LogoScreen() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: "linear-gradient(180deg, #FFF8EA 0%, #FFFFFF 52%, #F1F5F4 100%)" }}
    >
      <div className="relative h-[9%] w-[46%]">
        <Image src="/images/brand/logo escura.svg" alt="Cultiv" fill className="object-contain" />
      </div>
    </div>
  );
}
