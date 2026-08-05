const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

export async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !fromEmail) return;

  const res = await fetch(SENDGRID_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: fromEmail, name: "Aromia" },
      subject: "Listo — vas a recibir alertas de Aromia",
      content: [
        {
          type: "text/plain",
          value:
            "Te suscribiste a las alertas de Aromia. Te avisamos por acá cuando haya bajadas de precio y contenido nuevo del Magazine.",
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`SendGrid respondió ${res.status}: ${await res.text()}`);
  }
}
