import type { Metadata } from "next";
import Link from "next/link";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import styles from "./subBatch01Story.module.css";

type StoryBlock =
  | { kind: "heading"; text: string; number: number }
  | { kind: "paragraph"; text: string }
  | { kind: "visual"; index: number };

interface ParsedStory {
  slug: string;
  title: string;
  serie: string;
  deck: string;
  blocks: StoryBlock[];
}

export type SubBatch01Slug =
  | "antes-del-perfume-ya-oliamos"
  | "comprar-para-oler-o-comprar-para-tener"
  | "cuando-ya-no-hueles-tu-perfume"
  | "fougere-no-significa-viejo"
  | "huele-sintetico-que-estamos-diciendo"
  | "lavanda-limpia-medicinal-barata-elegante"
  | "nos-perfumamos-para-nosotros-o-para-los-demas"
  | "podemos-describir-un-olor-sin-compararlo"
  | "por-que-una-lista-de-notas-no-te-dice-como-huele";

const visualAssets: Partial<Record<SubBatch01Slug, Partial<Record<number, string>>>> = {
  "antes-del-perfume-ya-oliamos": {
    0: "01A-antes-del-perfume-ya-oliamos.jpg",
  },
};

function draftDirectory() {
  const candidates = [
    path.join(process.cwd(), "drafts"),
    path.join(process.cwd(), "..", "..", "drafts"),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

function readDraft(slug: SubBatch01Slug) {
  const directory = draftDirectory();
  if (!directory) throw new Error("Aromia drafts directory was not found during build.");
  return readFileSync(path.join(directory, `${slug}.md`), "utf8");
}

function plainMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function frontmatterValue(source: string, key: string) {
  const match = source.match(new RegExp(`^${key}:\\s*[\"']?(.+?)[\"']?\\s*$`, "m"));
  return match?.[1]?.replace(/[\"']$/, "").trim() ?? "";
}

function parseStory(slug: SubBatch01Slug): ParsedStory {
  const source = readDraft(slug);
  const title = frontmatterValue(source, "titulo") || slug.replaceAll("-", " ");
  const serie = frontmatterValue(source, "serie") || "Historias";
  const articleStart = source.indexOf(`\n# ${title}`);
  const article = articleStart >= 0 ? source.slice(articleStart + 1) : source;
  const lines = article.split(/\r?\n/);
  const blocks: StoryBlock[] = [];
  let paragraph: string[] = [];
  let inFence = false;
  let visualIndex = 0;
  let headingNumber = 0;

  const flushParagraph = () => {
    const text = plainMarkdown(paragraph.join(" "));
    if (text) blocks.push({ kind: "paragraph", text });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();

    if (line.startsWith("```")) {
      flushParagraph();
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (line.startsWith("Nota para Code:")) break;
    if (line.startsWith("# ")) continue;

    if (line === "[AROMIA_VISUAL_OPPORTUNITY]") {
      flushParagraph();
      blocks.push({ kind: "visual", index: visualIndex });
      visualIndex += 1;
      while (i + 1 < lines.length && lines[i + 1].trim() !== "") i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      headingNumber += 1;
      blocks.push({ kind: "heading", text: plainMarkdown(line.slice(3)), number: headingNumber });
      continue;
    }

    if (!line) {
      flushParagraph();
      continue;
    }

    paragraph.push(line);
  }
  flushParagraph();

  const firstParagraph = blocks.find((block) => block.kind === "paragraph") as
    | { kind: "paragraph"; text: string }
    | undefined;
  const deck = firstParagraph?.text ?? "Una historia editorial de Aromia.";
  let removedDeck = false;
  const bodyBlocks = blocks.filter((block) => {
    if (!removedDeck && block.kind === "paragraph" && block.text === deck) {
      removedDeck = true;
      return false;
    }
    return true;
  });

  return { slug, title, serie, deck, blocks: bodyBlocks };
}

export function makeSubBatchMetadata(slug: SubBatch01Slug): Metadata {
  const story = parseStory(slug);
  return {
    title: { absolute: `${story.title} | Aromia` },
    description: story.deck,
    alternates: { canonical: `/historias/${slug}` },
    openGraph: { title: story.title, description: story.deck, type: "article" },
  };
}

function NativeVisual({ slug, index }: { slug: SubBatch01Slug; index: number }) {
  if (slug === "antes-del-perfume-ya-oliamos" && index === 1) {
    return <div className={`${styles.visual} ${styles.materialField}`} aria-hidden="true" />;
  }

  if (slug === "huele-sintetico-que-estamos-diciendo" && index === 1) {
    return (
      <div className={`${styles.visual} ${styles.pullPause}`}>
        <p>Lo natural y lo sintético no llegan a la nariz con una etiqueta.</p>
      </div>
    );
  }

  if (slug === "lavanda-limpia-medicinal-barata-elegante" && index === 1) {
    return (
      <div className={`${styles.visual} ${styles.markerRow}`} aria-label="Contextos culturales de la lavanda">
        <span>limpia</span><span>farmacia</span><span>barbería</span><span>prestigio</span>
      </div>
    );
  }

  if (slug === "podemos-describir-un-olor-sin-compararlo" && index === 1) {
    return (
      <div className={`${styles.visual} ${styles.languagePause}`}>
        <p>Nombramos el olor buscando otra cosa que ya conocemos.</p>
      </div>
    );
  }

  return null;
}

function StoryVisual({ slug, index }: { slug: SubBatch01Slug; index: number }) {
  const filename = visualAssets[slug]?.[index];
  if (filename) {
    return (
      <figure className={`${styles.visual} ${index === 0 ? styles.photoOpening : ""}`}>
        {/* Canonical binary is served directly from the quarantined repo asset directory. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/editorial-asset/${filename}`}
          alt="Vista editorial observacional que acompaña la historia."
          loading={index === 0 ? "eager" : "lazy"}
        />
        <figcaption className={styles.visualCaption}>Fotografía editorial · Aromia</figcaption>
      </figure>
    );
  }

  return <NativeVisual slug={slug} index={index} />;
}

export function SubBatch01Story({ slug }: { slug: SubBatch01Slug }) {
  const story = parseStory(slug);

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.hero}>
          <div>
            <p className={styles.kicker}>{story.serie}</p>
            <h1 className={styles.title}>{story.title}</h1>
          </div>
          <p className={styles.deck}>{story.deck}</p>
        </header>

        <div className={styles.flow}>
          {story.blocks.map((block, index) => {
            if (block.kind === "visual") {
              return <StoryVisual key={`visual-${block.index}`} slug={slug} index={block.index} />;
            }
            if (block.kind === "heading") {
              return (
                <div className={styles.headingWrap} key={`heading-${index}`}>
                  <span className={styles.sectionNumber}>{String(block.number).padStart(2, "0")}</span>
                  <h2>{block.text}</h2>
                </div>
              );
            }
            return (
              <div className={styles.paragraph} key={`paragraph-${index}`}>
                <p>{block.text}</p>
              </div>
            );
          })}
        </div>

        <aside className={styles.close}>
          <p className={styles.kicker}>Seguir explorando</p>
          <Link href="/magazine">Ver todas las historias →</Link>
        </aside>
      </article>
    </main>
  );
}
