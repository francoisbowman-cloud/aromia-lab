"use client";

import { useState } from "react";

type Ingrediente = {
  nombre: string;
  familia: string;
  imagen: string;
  descripcion: string;
  usos: string;
};

const ingredientes: Ingrediente[] = [
  {
    nombre: "Bergamota",
    familia: "Cítrica",
    imagen:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Cítrico italiano de aroma fresco y ligeramente amargo. Es la nota de salida más usada de la perfumería moderna — abre casi cualquier fragancia con un destello luminoso antes de dar paso al resto de la pirámide.",
    usos: "Bleu de Chanel, Terre d'Hermès, Erba Pura",
  },
  {
    nombre: "Cardamomo",
    familia: "Especiada",
    imagen:
      "https://images.unsplash.com/photo-1642255521852-7e7c742ac58f?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Especia cálida y ligeramente mentolada. Aporta un toque especiado sofisticado sin la agresividad de la pimienta, muy usada para dar carácter a las notas de salida masculinas.",
    usos: "Sauvage, Layton, Le Male",
  },
  {
    nombre: "Jengibre",
    familia: "Especiada",
    imagen:
      "https://images.unsplash.com/photo-1630623093145-f606591c2546?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Picante, cítrico y vibrante. Se usa en pequeñas dosis para dar energía y frescura especiada a la salida, sin dominar el resto de la composición.",
    usos: "Y Eau de Parfum",
  },
  {
    nombre: "Ylang Ylang",
    familia: "Floral",
    imagen:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Flor tropical de aroma cremoso, casi narcótico. Junto al jazmín, es uno de los pilares del acuerdo floral blanco que define a Chanel N°5 y sus herederos.",
    usos: "Flowerbomb, La Vie Est Belle",
  },
  {
    nombre: "Rosa",
    familia: "Floral",
    imagen:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "La flor más estudiada en perfumería. Su faceta puede ser fresca y verde (rosa de mayo) o densa y confitada (rosa turca) según el perfume que la use.",
    usos: "Delina, Libre, Miss Dior",
  },
  {
    nombre: "Café",
    familia: "Gourmand",
    imagen:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Nota tostada y amarga que ancla composiciones dulces, evitando que se vuelvan empalagosas. Un recurso relativamente reciente en perfumería fina.",
    usos: "Black Opium",
  },
  {
    nombre: "Vetiver",
    familia: "Amaderada",
    imagen:
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Raíz de aroma terroso, ahumado y ligeramente amargo. Es una de las materias primas más versátiles: puede ser fresca (vetiver verde) o densa y ahumada según cómo se destile.",
    usos: "Terre d'Hermès",
  },
  {
    nombre: "Ámbar",
    familia: "Amberada",
    imagen:
      "https://images.unsplash.com/photo-1631624406592-f599694e6b2c?auto=format&fit=crop&w=700&q=70",
    descripcion:
      "Más que un ingrediente único, es un acuerdo — labdanum, vainilla y resinas que recrean el aroma fósil del ámbar real. Da calidez, densidad y una estela inconfundible.",
    usos: "Baccarat Rouge 540 EDP, Erba Pura",
  },
];

export function IngredientesGrid() {
  const [seleccionado, setSeleccionado] = useState<Ingrediente | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ingredientes.map((ing) => (
          <button
            key={ing.nombre}
            type="button"
            onClick={() => setSeleccionado(ing)}
            className="group flex flex-col text-left"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ing.imagen}
                alt={ing.nombre}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="font-display text-lg font-semibold leading-tight">{ing.nombre}</p>
                <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[.14em] text-white/80">
                  {ing.familia}
                </p>
              </div>
            </div>
            <span className="mt-3 self-start border-b border-gold-contrast font-sans text-[11px] uppercase tracking-[.1em] text-gold-contrast">
              Descubrir +
            </span>
          </button>
        ))}
      </div>

      {seleccionado ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
          onClick={() => setSeleccionado(null)}
        >
          <div
            className="grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-card bg-surface sm:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square sm:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={seleccionado.imagen}
                alt={seleccionado.nombre}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative flex flex-col gap-3 p-8">
              <button
                type="button"
                onClick={() => setSeleccionado(null)}
                aria-label="Cerrar"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-gold hover:text-ink"
              >
                ✕
              </button>
              <p className="font-sans text-[11px] uppercase tracking-[.16em] text-gold-contrast">
                {seleccionado.familia}
              </p>
              <h3 className="font-display text-2xl font-semibold text-ink">
                {seleccionado.nombre}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-muted">
                {seleccionado.descripcion}
              </p>
              <p className="mt-2 border-t border-line pt-3 font-sans text-xs text-muted">
                <strong className="font-medium text-ink">Se usa en:</strong> {seleccionado.usos}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
