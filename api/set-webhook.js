export default async function handler(req, res) {
  const BOT = '8753571434:AAGBQ_5bkCHCdkrb0olq0gfxJ9CFF7IAcDg';
  const URL = 'https://studentmarket-tdjy.vercel.app/api/tg-webhook';
  try {
    await fetch('https://api.telegram.org/bot' + BOT + '/deleteWebhook');
    const r = await fetch('https://api.telegram.org/bot' + BOT + '/setWebhook?url=' + encodeURIComponent(URL));
    const d = await r.json();
    const info = await fetch('https://api.telegram.org/bot' + BOT + '/getWebhookInfo');
    const infoData = await info.json();
    res.status(200).json({ setResult: d, webhookInfo: infoData });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
