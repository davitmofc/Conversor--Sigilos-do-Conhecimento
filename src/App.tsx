"use client";
import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { TextBounds } from "html2canvas/dist/types/css/layout/text";

function MainComponent() {
  const [text, setText] = useState("");
  const [symbolSize, setSymbolSize] = useState(40);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const resultRef = useRef(null);

  // Mapa de letras para imagens
  const symbolMap = {
    a: "https://i.imgur.com/rcX1PGP.png",
    b: "https://i.imgur.com/hhnBbzr.png",
    c: "https://i.imgur.com/FXEWWA5.png",
    d: "https://i.imgur.com/XmetF1m.png",
    e: "https://i.imgur.com/z5Shx59.png",
    f: "https://i.imgur.com/xWh25dg.png",
    g: "https://i.imgur.com/xMS5KFc.png",
    h: "https://i.imgur.com/qSn0fOI.png",
    i: "https://i.imgur.com/lFQbLMS.png",
    j: "https://i.imgur.com/QP5C82e.png",
    k: "https://i.imgur.com/WYAHHAH.png",
    l: "https://i.imgur.com/FeMnfJq.png",
    m: "https://i.imgur.com/FG0Idrm.png",
    n: "https://i.imgur.com/QgjUo5d.png",
    o: "https://i.imgur.com/N90FQma.png",
    p: "https://i.imgur.com/fdSPlZK.png",
    q: "https://i.imgur.com/nkWIOk8.png",
    r: "https://i.imgur.com/KSXnTFP.png",
    s: "https://i.imgur.com/Gp6miYw.png",
    t: "https://i.imgur.com/VwSB9Bo.png",
    u: "https://i.imgur.com/mwmFVuK.png",
    v: "https://i.imgur.com/frL59E6.png",
    w: "https://i.imgur.com/ha7u49u.png",
    x: "https://i.imgur.com/5BWUrE2.png",
    y: "https://i.imgur.com/vMs8Qty.png",
    z: "https://i.imgur.com/Eipd3ux.png",
    ".": "https://i.imgur.com/N4Lj254.png",
    ",": "https://i.imgur.com/NCYBjZK.png",
    "?": "https://i.imgur.com/GD2L4H4.png",
    "!": "https://i.imgur.com/OJWSaRq.png",
    ":": "https://i.imgur.com/DV83lyA.png",
    ";": "https://i.imgur.com/bV2h9Du.png",
  };

  function removerAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  // Capturar input do usuário
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textoNormalizado = removerAcentos(e.target.value.toLowerCase());
    setText(textoNormalizado);
  };

  // Verificar se todas as imagens foram carregadas antes de capturar
  useEffect(() => {
    const imageElements = Object.values(symbolMap).map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = "anonymous";
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(imageElements).then(() => setImagesLoaded(true));
  }, [text]);

  // Função para baixar a área como imagem
  const handleDownloadImage = () => {
    if (resultRef.current && imagesLoaded) {
      html2canvas(resultRef.current, {
        backgroundColor: null,
        useCORS: true, 
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "texto_com_simbolos.png";
        link.click();
      });
    } else {
      alert("Aguarde o carregamento das imagens antes de baixar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-roboto mb-6 text-center text-gray-800">
          Conversor de Texto para Alfabeto Ocultista
        </h1>

        <div className="space-y-6">
          {/* Campo de entrada */}
          <div>
            <label className="block text-gray-700 mb-2 font-roboto">
              Digite seu texto:
            </label>
            <textarea
              onChange={handleInput}
              value={text}
              rows={1}
              className="w-full p-3 border rounded resize-none overflow-hidden"
              placeholder="Digite algo..."
              onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto"; // Reseta altura
              target.style.height = target.scrollHeight + "px"; // Ajusta dinamicamente
              }}
            ></textarea>
          </div>

          {/* Controle de tamanho dos símbolos */}
          <div>
            <label className="block text-gray-700 mb-2 font-roboto">
              Ajustar tamanho dos símbolos: {symbolSize}px
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={symbolSize}
              onChange={(e) => setSymbolSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Área de conversão */}
          <div>
            <label className="block text-gray-700 mb-2 font-roboto">
              Resultado:
            </label>
            <div
              ref={resultRef}
              className="w-full bg-transparent rounded-lg p-3 overflow-auto flex flex-wrap gap-2 border border-gray-300"
              style={{
                minHeight: "100px",
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {text.split("").map((char, index) => {
                if (char === " ") {
                  return (
                    <span key={index} style={{ width: symbolSize / 2 }}></span>
                  );
                }

                return symbolMap[char] ? (
                  <img
                    key={index}
                    src={symbolMap[char]}
                    alt={`Símbolo para ${char}`}
                    style={{
                      width: symbolSize,
                      height: symbolSize * 1.33,
                      objectFit: "contain",
                    }}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span
                    key={index}
                    style={{
                      width: symbolSize,
                      height: symbolSize,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Botão para baixar como imagem */}
          <button
            onClick={handleDownloadImage}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            disabled={!imagesLoaded}
          >
            {imagesLoaded ? "Baixar como Imagem" : "Carregando imagens..."}
          </button>
          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Site desenvolvido por <strong>davitmofc</strong>.
            </p>
            <p>
              Os símbolos utilizados pertencem a{" "}
              <strong>Rafael Lange (Cellbit)</strong> e fazem parte do RPG{" "}
              <a
                href="https://youtube.com/@ordemparanormal?si=GaVWZjtQsIBdPh-X"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Ordem Paranormal
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
