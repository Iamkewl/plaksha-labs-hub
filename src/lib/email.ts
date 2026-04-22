type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type SendEmailResult = {
  sent: boolean;
  provider: "disabled" | "resend" | "smtp";
  messageId?: string;
};

function resolveProvider(): "disabled" | "resend" | "smtp" {
  const raw = (process.env.EMAIL_PROVIDER ?? "disabled").toLowerCase();
  if (raw === "resend") return "resend";
  if (raw === "smtp") return "smtp";
  return "disabled";
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return { sent: false, provider: "resend" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("[Email] Resend send failed", await response.text());
    return { sent: false, provider: "resend" };
  }

  const json = (await response.json()) as { id?: string };
  return { sent: true, provider: "resend", messageId: json.id };
}

async function sendViaSmtpStub(input: SendEmailInput): Promise<SendEmailResult> {
  // SMTP path is intentionally a stub until a transport package is added.
  console.warn("[Email] SMTP provider selected but SMTP transport is not configured", {
    to: input.to,
    subject: input.subject,
  });
  return { sent: false, provider: "smtp" };
}

export async function sendTransactionalEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const provider = resolveProvider();

  if (provider === "disabled") {
    console.info("[Email] Skipped transactional email (provider disabled)", {
      to: input.to,
      subject: input.subject,
    });
    return { sent: false, provider: "disabled" };
  }

  if (provider === "resend") {
    return sendViaResend(input);
  }

  return sendViaSmtpStub(input);
}
