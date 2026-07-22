import { transporter } from '@/lib/mail'

export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  token: string,
) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`

  return await transporter.sendMail({
    from: `"BLACKWALL_OPS" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `[SYSTEM_UPLINK] ENCRYPTION_KEY_RESET_FOR_${username.toUpperCase()}`,
    html: `
      <div style="background:#09090B; color:#10B981; font-family:monospace; padding:60px; border:2px solid #27272A;">
        <h2 style="border-bottom:1px solid #27272A; padding-bottom:10px;">> ENCRYPTION_KEY_OVERRIDE_REQUESTED</h2>
        <p>Operative: <strong>${username}</strong></p>

        <p>A request to override your current access credentials has been initiated. If this was authorized by you, proceed to synchronize a new key.</p>

        <div style="margin:40px 0;">
          <a href="${resetLink}" style="color:#09090B; display: inline-block; background: #10B981; padding:15px; text-decoration:none; outline: none; font-weight:bold; border:1px solid #10B981;">
            [ INITIALIZE_NEW_KEY ]
          </a>
        </div>

        <p style="color:#A1A1AA; font-size:14px; margin-bottom: 30px;">
           If you did not request this override, ignore this transmission. Your current clearance remains secure.
        </p>

        <p style="font-size:12px; color:#A1A1AA;">
          TRACE_ID: ${token}<br>
          STATUS: AWAITING_NEW_KEY<br>
          TIMESTAMP: ${new Date().toISOString()}
        </p>
      </div>
    `,
  })
}
