import Image from "next/image";

/**
 * Gate 3 visual-slot registry for Editorial v1.
 *
 * Decisions locked by ChatGPT in
 * `art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md`.
 *
 * A slot with `present: false` renders its CSS placeholder box. A documentary
 * slot (has `width`/`height`) renders as an intrinsic image with its
 * provenance caption in normal flow below it. An interpretive/hero slot
 * renders as a `fill` cover image.
 *
 * Important production rule: image-quality concerns must be solved by replacing
 * the source, not by hiding photography behind a CSS fallback. The three hero
 * slots below intentionally point at sharp photographic sources rather than the
 * earlier soft interpretive rasters.
 */

export type SlotType = "interpretive" | "documentary";

export interface VisualSlot {
  id: string;
  type: SlotType;
  present: boolean;
  file: string | null;
  width?: number;
  height?: number;
  quality?: number;
  alt: string;
  caption?: string;
  provenance?: string;
  placeholderLabel: string;
}

export const EDITORIAL_V1_SLOTS: Record<string, VisualSlot> = {
  "ambroxan-material-interpretive": {
    id: "ambroxan-material-interpretive",
    type: "interpretive",
    present: true,
    file: "/editorial-v1/clary-sage-documentary.jpg",
    quality: 95,
    alt: "Salvia sclarea en fotografía botánica, materia vegetal vinculada a la ruta sintética moderna del ambroxan.",
    provenance:
      "https://commons.wikimedia.org/wiki/File:Salvia_sclarea_001.JPG — autor: Llez — CC BY-SA 3.0 / GFDL",
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
    file: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Blood-red_rose_up_close_%28Unsplash%29.jpg",
    quality: 95,
    alt: "Primer plano fotográfico de una rosa rojo profundo, usada como imagen editorial del volumen floral asociado a Dominique Ropion.",
    provenance:
      "https://commons.wikimedia.org/wiki/File:Blood-red_rose_up_close_(Unsplash).jpg — Jez Timms — CC0 1.0",
    placeholderLabel:
      "Área visual interpretativa: exceso floral controlado. No representa evidencia documental.",
  },
  "amouage-material-density-interpretive": {
    id: "amouage-material-density-interpretive",
    type: "interpretive",
    present: true,
    file: "/editorial-v1/oman-place-documentary.jpg",
    quality: 95,
    alt: "Paisaje montañoso de Jabal Akhdar, Omán, contexto geográfico de la historia de la perfumería omaní contemporánea.",
    provenance:
      "https://commons.wikimedia.org/wiki/File:Landscape_of_Jabal_Akhdar,_Oman.jpg — autor: Ontheroadom — CC BY-SA 4.0",
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

  const isExternal = /^https?:\/\//.test(slot.file);

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
          unoptimized={isExternal}
        />
        {slot.caption ? <figcaption>{slot.caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure className={`${className} ev1-photo`}>
      <Image
        src={slot.file}
        alt={slot.alt}
        fill
        quality={slot.quality}
        sizes={sizes ?? "100vw"}
        unoptimized={isExternal}
        style={{ objectFit: "cover" }}
      />
    </figure>
  );
}
