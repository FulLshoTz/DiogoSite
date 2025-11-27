import React from "react";
import YoutubeSection from "../sections/YoutubeSection";
import NoticiasSection from "../sections/NoticiasSection";

export default function Home() {
  return (
    // 4. Reduzi de space-y-16 para space-y-8 para diminuir o buraco
    <div className="space-y-8 pb-10">
      <YoutubeSection />
      
      {/* 11. Se tivesses aqui <RacesSection /> ou <StatsSection />, bastava comentar assim: */}
      {/* <StatsSection /> */}
      
      <NoticiasSection />
    </div>
  );
}
