import Image from "next/image";

/**
 * Gate 3 visual-slot registry for Editorial v1.
 *
 * Decisions locked by ChatGPT in
 * `art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md`.
 *
 * A slot with `present: false` renders its CSS placeholder box. A documentary
 * slot (has `width`/`height`) renders as an intrinsic image with its
 * provenance caption in normal flow below it. Interpretive slots may use
 * either local Next/Image assets or approved external editorial photography.
 */

export type SlotType = "interpretive" | "documentary";

export interface VisualSlot {
  id: string;
  type: SlotType;
  present: boolean;
  file: string | null;
  /** intrinsic pixel size — required for documentary (intrinsic) rendering */
  width?: number;
  height?: number;
  /** Next/Image delivery quality for local assets. */
  quality?: number;
  alt: string;
  caption?: string;
  provenance?: string;
  /** aria-label used on the placeholder while `present` is false */
  placeholderLabel: string;
}

export const EDITORIAL_V1_SLOTS: Record<string, VisualSlot> = {
  "ambroxan-material-interpretive": {
    id: "ambroxan-material-interpretive",
    type: "interpretive",
    present: true,
    file: "https://images.unsplash.com/photo-1760651913943-0208e0fef0bc?auto=format&fit=crop&w=3000&q=90",
    alt: "Macro editorial de cristales claros creciendo sobre una superficie mineral oscura, con planos de foco definidos y textura geológica visible.",
    provenance:
      "Unsplash — Albert Hyseni — Close-up of clear crystals growing on metallic rock — free under the Unsplash License — https://unsplash.com/photos/close-up-of-clear-crystals-growing-on-metallic-rock-CINUF3Rwoaw",
    placeholderLabel:
      "Área visual interpretativa: estudio material del ambroxan. No representa evidencia documental.",
  },
  "clary-sage-documentary": {
    id: "clary-sage-documentary",
    type: "documentary",
    present: true,
    file: "/editorial-v1/clary-sage-documentary.jpg",
    width: 1309,
    height: 1746,
    alt: "Planta de Salvia sclarea (salvia romana), de cuyo esclareol deriva la ruta sintética del ambroxan.",
    caption:
      "Salvia sclarea (salvia romana). Foto: Llez, Wikimedia Commons, CC BY-SA 3.0.",
    provenance:
      "https://commons.wikimedia.org/wiki/File:Salvia_sclarea_001.JPG — autor: Llez — CC BY-SA 3.0 / GFDL",
    placeholderLabel:
      "Espacio reservado para imagen documental de Salvia sclarea, pendiente de descarga con procedencia.",
  },
  "ropion-overdose-interpretive": {
    id: "ropion-overdose-interpretive",
    type: "interpretive",
    present: true,
    file: "https://images.unsplash.com/photo-1579135010601-a1f2548b5502?auto=format&fit=crop&w=3000&q=90",
    alt: "Macro editorial de una rosa roja intensa, con pétalos definidos y textura floral visible en el plano principal.",
    provenance:
      "Unsplash — Pedro Vit — Macro photography of blooming red rose flower — free under the Unsplash License — https://unsplash.com/photos/macro-photography-of-blooming-red-rose-flower-N2PK1ghtlkg",
    placeholderLabel:
      "Área visual interpretativa: exceso floral controlado. No representa evidencia documental.",
  },
  "amouage-material-density-interpretive": {
    id: "amouage-material-density-interpretive",
    type: "interpretive",
    present: true,
    file: "https://images.unsplash.com/photo-1773165896916-e13ff8e0f801?auto=format&fit=crop&w=3000&q=90",
    alt: "Macro editorial de una gota de resina ámbar sobre madera erosionada, con veta, corteza y materia orgánica nítidas.",
    provenance:
      "Unsplash — Mohammed Rahimov — A drop of golden resin on weathered wood — free under the Unsplash License — https://unsplash.com/photos/a-drop-of-golden-resin-on-weathered-wood-aAPZ0lazesk",
    placeholderLabel:
      "Área visual interpretativa: densidad material. No representa evidencia documental.",
  },
  "oman-place-documentary": {
    id: "oman-place-documentary",
    type: "documentary",
    present: true,
    file: "/editorial-v1/oman-place-documentary.jpg",
    width: 1920,
    height: 1080,
    alt: "Paisaje de Jabal Akhdar, Omán: terreno calcáreo y vegetación de montaña.",
    caption:
      "Jabal Akhdar, Omán. Foto: Ontheroadom, Wikimedia Commons, CC BY-SA 4.0.",
    provenance:
      "https://commons.wikimedia.org/wiki/File:Landscape_of_Jabal_Akhdar,_Oman.jpg — autor: Ontheroadom — CC BY-SA 4.0",
    placeholderLabel:
      "Espacio reservado para imagen documental de Jabal Akhdar (Omán), pendiente de descarga con procedencia.",
  },
  "coleccionista-shelf-interpretive": {
    id: "coleccionista-shelf-interpretive",
    type: "interpretive",
    present: true,
    file: "/editorial-v1/coleccionista-shelf-01.jpg",
    alt: "Fotografía de un estante doméstico con una veintena de frascos de perfume de siluetas y alturas distintas agrupados sin espacio libre sobre un mueble claro; un paño azulado a un lado y cajas de guardado debajo. Ninguna marca es legible.",
    placeholderLabel:
      "Área visual interpretativa pendiente: estante doméstico que ya no tiene espacio. Imagen no generada; especificación en el handoff de assets.",
  },
  "frankincense-documentary": {
    id: "frankincense-documentary",
    type: "documentary",
    present: true,
    file: "/editorial-v1/frankincense-documentary.jpg",
    width: 1920,
    height: 1440,
    alt: "Boswellia sacra, el árbol del incienso, en Wadi Dowkah, Dhofar, Omán.",
    caption:
      "Boswellia sacra, Wadi Dowkah, Dhofar, Omán. Foto: Krzysztof Ziarnek (Kenraiz), Wikimedia Commons, CC BY-SA 4.0.",
    provenance:
      "https://commons.wikimedia.org/wiki/File:Boswellia_sacra_kz05.jpg — autor: Krzysztof Ziarnek, Kenraiz — CC BY-SA 4.0",
    placeholderLabel:
      "Espacio reservado para imagen documental de Boswellia sacra (Dhofar, Omán), pendiente de descarga con procedencia.",
  },
};

interface VisualFieldProps {
  slotId: string;
  className: string;
  marker?: string;
  sizes?: string;
}

export function VisualField({ slotId, className, marker, sizes }: VisualFieldProps) {
  const slot = EDITORIAL_V1_SLOTS[slotId];

  if (!slot || !slot.present || !slot.file) {
    return (
      <div
        className={className}
        role="img"
        aria-label={slot?.placeholderLabel ?? "Área visual pendiente"}
      >
        {marker ? <span>{marker}</span> : null}
      </div>
    );
  }

  if (slot.width && slot.height) {
    return (
      <figure className={`${className} ev1-doc-figure`}>
        <Image
          className="ev1-doc-img"
          src={slot.file}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          quality={slot.quality}
          sizes={sizes ?? "100vw"}
        />
        {slot.caption ? <figcaption>{slot.caption}</figcaption> : null}
      </figure>
    );
  }

  const isExternal = slot.file.startsWith("https://");

  return (
    <figure className={className}>
      {isExternal ? (
        <img
          className="ev1-interpretive-img"
          src={slot.file}
          alt={slot.alt}
          loading={slot.id === "amouage-material-density-interpretive" ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <Image
          src={slot.file}
          alt={slot.alt}
          fill
          quality={slot.quality}
          sizes={sizes ?? "100vw"}
          style={{ objectFit: "cover" }}
        />
      )}
    </figure>
  );
}
