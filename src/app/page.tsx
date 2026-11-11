import { Suspense } from "react";
import About from "@/components/About";
import HeroPage from "@/components/HeroPage";

export default function Home() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-[420px] w-full animate-pulse bg-muted md:min-h-[520px]" />
        }
      >
        <HeroPage />
      </Suspense>
      <About />
    </>
  );
}
