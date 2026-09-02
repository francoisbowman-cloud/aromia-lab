import Image from "next/image";

/**
 * Gate 3 visual-slot registry for Editorial v1.
 *
 * Decisions locked by ChatGPT in
 * `art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md`.
 *
 * A slot with `present: false` renders its CSS placeholder box. A documentary
 * slot (has `width`/`height`) renders as an intrinsic image with its
 * provenance caption in normal flow below it. An interpretive slot renders as
 * a `fill` cover image. Wiring an approved asset: drop the file under
 * `apps/web/public/editorial-v1/`, set `present: true`, `file`, and — for
 * documentary — `width`/`height` + `caption` + `provenance`.
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
  /** Next/Image delivery quality. Raise selectively for texture-critical interpretive art. */
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
    file: "/editorial-v1/ambroxan-resin-abstract-01.jpg",
    quality: 95,
    alt: "Naturaleza muerta editorial de materia translúcida cálida sobre una superficie mineral. Imagen interpretativa de la sensación material del ambroxan; el objeto no pretende ser ambroxan real.",
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
    file: "/editorial-v1/ropion-bordeaux-texture-01.jpg",
    quality: 95,
    alt: "Naturaleza muerta editorial de una rosa burdeos oscura y materia floral densa. Imagen interpretativa del exceso floral controlado asociado a la técnica de sobredosis.",
    placeholderLabel:
      "Área visual interpretativa: exceso floral controlado. No representa evidencia documental.",
  },
  "amouage-material-density-interpretive": {
    id: "amouage-material-density-interpretive",
    type: "interpretive",
    present: true,
    file: "/editorial-v1/amouage-mineral-density-01.jpg",
    quality: 95,
    alt: "Naturaleza muerta editorial de resinas, madera, materia mineral y humo. Imagen interpretativa de la densidad material de una fórmula compleja; no representa una fórmula ni un producto literal.",
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
  // El coleccionista — Asset A v2 (opening domestic collection scene).
  // Spec locked in art-direction/el-coleccionista-visual-assets-handoff.md;
  // v2 passed ChatGPT visual quarantine (relay v22) — an observed crowded
  // domestic shelf, not a campaign still. Interpretive, not documentary.
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
  /** decorative label shown inside the placeholder (e.g. the resin marker) */
  marker?: string;
  sizes?: string;
}

/**
 * Renders an approved asset when present, otherwise the CSS placeholder box.
 * While no slot is `present`, no `next/image` is emitted, so a missing binary
 * cannot break the build.
 */
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

  // Documentary: intrinsic image, provenance caption in normal flow below.
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

  // Interpretive: fill cover.
  return (
    <figure className={className}>
      <Image
        src={slot.file}
        alt={slot.alt}
        fill
        quality={slot.quality}
        sizes={sizes ?? "100vw"}
        style={{ objectFit: "cover" }}
      />
    </figure>
  );
}
