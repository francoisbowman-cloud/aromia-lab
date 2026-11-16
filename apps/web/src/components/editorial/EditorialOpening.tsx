import Image from "next/image";
import type { ReactNode } from "react";

export function EditorialOpening({ label, title, description, image, children }: {
  label: string; title: string; description: string; children?: ReactNode;
  image?: { src: string; alt: string; credit: string; botanical?: boolean };
}) {
  return <header className={`ed-opening ${image ? "ed-opening--image" : ""}`}>
    <div><p className="ed-label">{label}</p><h1>{title}</h1><p className="ed-intro">{description}</p>{children && <div className="ed-opening-actions">{children}</div>}</div>
    {image && <figure className={image.botanical ? "ed-opening-botanical" : ""}>
      <div className="ed-opening-image"><Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 700px) 100vw, 45vw" style={{objectFit: image.botanical ? "contain" : "cover"}} /></div>
      <figcaption>{image.credit}</figcaption>
    </figure>}
  </header>;
}
