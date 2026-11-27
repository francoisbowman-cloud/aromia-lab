"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { LazyMotion, m, useReducedMotion, useScroll, useTransform } from "motion/react";

const subscribeNothing = () => () => {};
const features = () => import("./motionFeatures").then((module) => module.default);

/** A small drift within an interpretive image, never documentary evidence.
 * The frame and image render on the server; JavaScript never gates visibility. */
export function EditorialImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  // The reduced-motion preference only exists on the client; applying it before
  // hydration finishes made the server and client styles differ (React #418).
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const reducedMotion = useReducedMotion() && hydrated;
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <div ref={frame} className={className}>
      <LazyMotion features={features} strict>
        <m.div
          className="editorial-motion-image"
          initial={false}
          style={{ y: reducedMotion ? 0 : y, scale: reducedMotion ? 1 : 1.1 }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} quality={85} />
        </m.div>
      </LazyMotion>
    </div>
  );
}
