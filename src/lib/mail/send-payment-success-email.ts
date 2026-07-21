import { transporter } from '@/lib/mail'
import { Prisma } from '../../../generated/prisma'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true }
}>

export const sendOrderSuccessEmail = async (
  email: string,
  username: string,
  order: OrderWithItems,
) => {
  const orderId = order.id.toUpperCase()
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })

  return await transporter.sendMail({
    from: `"BLACKWALL_OPS" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `[CONFIRMED] Blackwall Order ${orderId}`,
    html: `
      <div role="article" aria-roledescription="email" aria-label="Blackwall order confirmation" lang="en" style="background-color:#09090B; color:#10B981; padding: 20px;">
        <div style="max-width: 600px; margin: auto; font-family: monospace; padding: 20px; border: 2px solid #27272A;">
          <h1 style="color: #10B981 !important; display: inline-block; font-size: 22px; margin-bottom: 20px;" aria-label="Uplink successful">
            <span aria-hidden="true">> UPLINK_SUCCESSFUL</span>
          </h1>

          <p style="margin-bottom: 10px;">Operative: <strong style="color: #fff;">${username.toUpperCase()}</strong></p>
          <p style="margin-bottom: 20px; font-size: 12px; color: #A1A1AA;">Transaction ID: ${orderId}</p>

          <table role="presentation" width="100%" style="border-collapse: collapse; margin: 20px 0; background: #18181B; border-left: 4px solid #10B981;">
            <thead>
              <tr>
                <th colspan="2" style="padding: 10px; color: #A1A1AA; font-size: 11px; border-bottom: 1px solid #27272A; text-align: left;" aria-label="Downloaded assets">
                  <span aria-hidden="true">[ DOWNLOADED_ASSETS ]</span>
                </th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 12px 10px; font-size: 13px; border-bottom: 1px solid #27272A;">
                    <span aria-hidden="true" style="margin-right: 5px;">></span>${item.name}
                  </td>
                  <td style="padding: 12px 10px; font-size: 13px; text-align: right; border-bottom: 1px solid #27272A; color: #fff;">
                    ${item.quantity} x $${item.price.toFixed(2)}
                  </td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px 10px; font-size: 16px; font-weight: bold; color: #10B981;" aria-label="Total value">
                  <span aria-hidden="true">TOTAL_VALUE</span>
                </td>
                <td style="padding: 15px 10px; font-size: 16px; font-weight: bold; text-align: right; color: #fff;">
                  $${order.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="margin: 30px 0; padding: 15px; border: 1px dashed #27272A; background-color: #0d1a14;">
            <p style="margin-bottom: 10px; font-size: 12px; color: #A1A1AA;" aria-label="Support section">
              <span aria-hidden="true">[ </span>SUPPORT_UPLINK<span aria-hidden="true"> ]</span>
            </p>
            <p style="font-size: 13px; margin-bottom: 5px; color: #10B981;">
              Detected issues with transmission or assets?
            </p>
            <p style="font-size: 13px; color: #10B981;">
              Signal terminal:
              <a href="mailto:support@blackwall.tech?subject=ISSUE_REPORT_ORDER_${orderId}" 
                style="color: #10B981; text-decoration: underline; font-weight: bold;">
                SUPPORT@BLACKWALL.TECH
              </a>
            </p>
          </div>

          <div style="font-size: 11px; color: #A1A1AA; border-top: 1px solid #27272A; padding-top: 15px; margin-top: 20px;">
            <div style="margin-bottom: 5px;" aria-label="System status: connection stable">
              <span aria-hidden="true" style="color: #10B981;">STATUS: </span>
              <span aria-hidden="true">STABLE_CONNECTION</span>
            </div>

            <div style="margin-bottom: 15px;" aria-label="Operation time: ${timestamp}">
              <span aria-hidden="true" style="color: #10B981;">TIMESTAMP: </span>
              <span aria-hidden="true">${timestamp}</span>
            </div>

            <div style="font-size: 10px; opacity: 0.5;" aria-label="Message generated automatically">
              <span aria-hidden="true">-- No reply transmission --</span>
            </div>
          </div>
        </div>
      </div>
    `,
  })
}
