export interface EmailLayoutOptions {
  preheader?: string;
  title: string;
  content: string;
  actionUrl?: string;
  actionText?: string;
  footerNote?: string;
}

export function emailLayout({
  preheader = 'SukhYatri — Travel in Comfort. Arrive in Joy.',
  title,
  content,
  actionUrl,
  actionText,
  footerNote,
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F2F5F4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #172B26;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: collapse; }
    img { border: 0; display: block; }
    a { color: #147A70; text-decoration: none; }
    .btn {
      display: inline-block;
      background-color: #147A70;
      color: #FFFFFF !important;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      padding: 14px 28px;
      border-radius: 9999px;
      text-decoration: none;
      letter-spacing: 0.02em;
    }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 12px !important; }
      .content-box { padding: 24px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F2F5F4;">
  <!-- Hidden Preheader -->
  <div style="display: none; font-size: 1px; color: #F2F5F4; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F2F5F4; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="max-width: 600px; width: 100%;">
          
          <!-- Header / Brand Wordmark -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 26px; font-weight: 800; color: #0B1A17; letter-spacing: -0.02em; line-height: 1.1;">
                      SukhYatri
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #C8A96A; text-transform: uppercase; letter-spacing: 0.18em; margin-top: 4px;">
                      Travel in Comfort. Arrive in Joy.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="content-box" style="background-color: #FFFFFF; border-radius: 24px; padding: 36px 36px; box-shadow: 0 4px 20px rgba(11, 26, 23, 0.04); border: 1px solid #E3E9E6;">
                <tr>
                  <td>
                    ${content}

                    ${
                      actionUrl && actionText
                        ? `
                    <!-- Action CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; margin-bottom: 8px;">
                      <tr>
                        <td align="center">
                          <a href="${actionUrl}" target="_blank" class="btn" style="display: inline-block; background-color: #147A70; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 9999px; text-decoration: none;">
                            ${actionText}
                          </a>
                        </td>
                      </tr>
                    </table>
                    `
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 28px; padding-bottom: 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-size: 12px; line-height: 18px; color: #72847E;">
                    ${
                      footerNote
                        ? `<p style="margin: 0 0 10px 0; font-weight: 500;">${footerNote}</p>`
                        : ''
                    }
                    <p style="margin: 0 0 6px 0;">
                      Questions or concierge requests? Reply directly or email <a href="mailto:concierge@sukhyatri.com" style="color: #147A70; font-weight: 600;">concierge@sukhyatri.com</a>
                    </p>
                    <p style="margin: 0 0 10px 0; color: #9AB0AA; font-size: 11px;">
                      Concierge Desk: +91 800 234 5678 · SukhYatri Technologies India Pvt. Ltd.
                    </p>
                    <p style="margin: 0; color: #A8B8B3; font-size: 11px;">
                      © ${new Date().getFullYear()} SukhYatri. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
