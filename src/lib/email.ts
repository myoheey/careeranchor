import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "[CareerAnchor] 비밀번호 재설정",
    html: `
      <div style="max-width:480px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a">
        <div style="padding:32px 24px;background:#0f172a;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="margin:0;font-size:20px;color:#fff">Career<span style="color:#3b82f6">Anchor</span></h1>
        </div>
        <div style="padding:32px 24px;background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px;font-size:15px">안녕하세요, <strong>${name}</strong>님.</p>
          <p style="margin:0 0 24px;font-size:14px;color:#64748b">비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새 비밀번호를 설정하세요.</p>
          <div style="text-align:center;margin:0 0 24px">
            <a href="${resetUrl}" style="display:inline-block;padding:10px 32px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500">비밀번호 재설정</a>
          </div>
          <p style="margin:0 0 8px;font-size:13px;color:#94a3b8">이 링크는 1시간 후 만료됩니다.</p>
          <p style="margin:0;font-size:13px;color:#94a3b8">본인이 요청하지 않았다면 이 이메일을 무시하세요.</p>
        </div>
      </div>
    `,
  });
}
