import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Aromia",
  description: "Qué información recoge Aromia, cómo la usa y qué opciones tienes al respecto.",
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6 py-16 lg:p-10 lg:py-24">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink lg:text-4xl">
          Política de Privacidad
        </h1>
        <p className="mt-2 font-sans text-xs text-muted">
          Última actualización: 18 de julio de 2026
        </p>
      </div>

      <p className="font-sans text-[15px] leading-relaxed text-ink">
        En Aromia (&ldquo;nosotros&rdquo;) respetamos tu privacidad y queremos que sepas con
        claridad qué información recogemos, cómo la usamos y qué opciones tienes al
        respecto.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          1. Qué información recogemos
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Aromia es un sitio de contenido editorial. No requerimos registro ni cuenta
          de usuario para navegar el comparador de perfumes, el Magazine o el quiz.
          Recogemos únicamente:
        </p>
        <ul className="list-disc pl-5 font-sans text-[15px] leading-relaxed text-ink">
          <li>
            <strong>Datos de navegación básicos</strong> (páginas visitadas, tipo de
            navegador, país aproximado) a través de estadísticas de analítica web
            estándar.
          </li>
          <li>
            <strong>Tu correo electrónico</strong>, únicamente si te suscribís
            voluntariamente a las alertas de bajada de precio de Aromia.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          2. Cómo usamos tu información
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Usamos el correo electrónico exclusivamente para enviarte las alertas y
          novedades que solicitaste. Nunca vendemos ni compartimos tu correo con
          terceros con fines comerciales ajenos a Aromia. Podés darte de baja en
          cualquier momento desde el propio correo que recibas.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          3. Enlaces de afiliados
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Aromia participa en el Programa de Afiliados de Amazon Services LLC, un
          programa de publicidad de afiliados diseñado para ofrecer a sitios web un
          medio para obtener comisiones por publicidad, publicitando y enlazando a
          productos en Amazon.com.
        </p>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          <strong>
            Como Afiliado de Amazon, ganamos por las compras que califican
          </strong>{" "}
          (&ldquo;As an Amazon Associate, we earn from qualifying purchases&rdquo;). Esto
          significa que si hacés clic en un enlace de producto en Aromia y realizás
          una compra en Amazon, podemos recibir una pequeña comisión, sin ningún
          costo adicional para vos.
        </p>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Amazon puede, a través de sus propias cookies y tecnologías, recoger
          información sobre tu visita cuando llegás desde Aromia. Esa recolección de
          datos está sujeta a la{" "}
          <a
            href="https://www.amazon.com/privacy"
            target="_blank"
            rel="noopener"
            className="text-gold-contrast underline"
          >
            Política de Privacidad de Amazon
          </a>
          , no a la nuestra.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          4. Cookies y analítica
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Aromia no utiliza cookies propias de seguimiento invasivo. Las
          preferencias de estilo visual (modo claro/oscuro) que elegís en el sitio
          se guardan localmente en tu navegador y no se transmiten a ningún
          servidor.
        </p>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Usamos Google Analytics para entender de forma agregada y anónima cómo se
          usa el sitio (páginas más visitadas, origen del tráfico). Google puede
          instalar cookies propias para esto — más información en la{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener"
            className="text-gold-contrast underline"
          >
            Política de Privacidad de Google
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          5. Tus derechos
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Podés solicitar en cualquier momento que eliminemos tu correo electrónico
          de nuestra lista de suscripción escribiéndonos, o simplemente usando el
          enlace de baja en cualquier correo recibido.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          6. Cambios a esta política
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Podemos actualizar esta Política de Privacidad ocasionalmente. Cualquier
          cambio se reflejará en esta misma página con la fecha de actualización
          correspondiente.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          7. Contacto
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink">
          Si tenés preguntas sobre esta política, podés contactarnos a través de los
          canales indicados en el sitio.
        </p>
      </section>
    </main>
  );
}
