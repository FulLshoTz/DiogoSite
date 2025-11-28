import React from "react";

export default function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 bg-black">
      
      {/* 1. A IMAGEM DE CARBONO */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          // O caminho começa com / porque está na pasta public
          backgroundImage: "url('/carbon.jpg')", 
          
          // 'repeat' faz com que a imagem se repita como azulejos (melhor qualidade)
          backgroundRepeat: "repeat", 
          
          // Tamanho do padrão. Ajusta isto se o carbono parecer muito grande ou pequeno
          backgroundSize: "200px", 
          
          // Opacidade para não ficar demasiado berrante e misturar com o preto
          opacity: 0.6 
        }}
      />

      {/* 2. SOMBRA NOS CANTOS (Vignette) */}
      {/* Isto é crucial para o site parecer profissional e focar o centro */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle, transparent 40%, #000000 100%)"
        }}
      />
      
      {/* 3. MÁSCARA ESCURA (Opcional) */}
      {/* Se a imagem for muito clara, isto escurece tudo uniformemente */}
      <div className="absolute inset-0 bg-black/40" />

    </div>
  );
}
