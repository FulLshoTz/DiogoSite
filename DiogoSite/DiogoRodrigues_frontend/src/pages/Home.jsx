import React from "react";
import YoutubeSection from "../sections/YoutubeSection";
import NoticiasSection from "../sections/NoticiasSection";

export default function Home() {
  return (
    <div className="space-y-16">
      <YoutubeSection />
      <NoticiasSection />
    </div>
  );
}
