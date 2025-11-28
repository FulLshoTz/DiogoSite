import React from "react";
// IMPORTANTE: Importar a imagem da pasta assets
// O "../" significa "voltar atrás uma pasta" (sair de components para ir a assets)
import carbonTexture from "../assets/carbon.jpg"; 

export default function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 bg-[#111]">
      
      {/* 1. A IMAGEM DE CARBONO */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          // Agora usamos a variável importada em vez de texto fixo
          backgroundImage: `url(${carbonTexture})`, 
          
          backgroundRepeat: "repeat", 
          backgroundSize: "200px", // Ajusta o tamanho do padrão aqui
          opacity: 0.6 
        }}
      />

      {/* 2. SOMBRA NOS CANTOS (Vignette) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle, transparent 40%, #000000 100%)"
        }}
      />
      
      {/* 3. MÁSCARA ESCURA */}
      <div className="absolute inset-0 bg-black/40" />

    </div>
  );
}
