export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  const BOT = '8753571434:AAGBQ_5bkCHCdkrb0olq0gfxJ9CFF7IAcDg';
  const GROUP = -5410980425;

  try {
    const u = req.body;
    if (!u || !u.message) return res.status(200).json({     ok:true});
    const msg = u.message;

    if (msg.chat.type === 'private') {
      const uid = msg.chat.id;
      const who = (msg.from.first_name || '') + (msg.from.last_name ? ' ' + msg.from.last_name : '');
 const nick = msg.from.username ? ' (@' + msg.from.username + ')' : '';
      const text = msg.text || '';

      if (text.startsWith('/start')) {
        await send(BOT, uid, '👋 Здравствуйте! Это техподдержка Ghost Market.\n\nНапишите свой вопрос — администратор ответит вам здесь.');
        return res.status(200).json({ok:true});
      }
      if (!text) {
        await send(BOT, uid, '✉️ Поддерживаются только текстовые сообщения.');
        return res.status(200).json({ok:true});
      }

      const header = '📩 Новое обращение\n\n👤 ' + who + nick + '\n🆔 ' + uid + '\n\n💬 ' + text + '\n\n———\nОтветьте Reply на это сообщение, чтобы отправить ответ.';
      await send(BOT, GROUP, header);
      await send(BOT, uid, '✅ Ваш вопрос отправлен. Ожидайте ответа.');
    }

    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
      const reply = msg.reply_to_message;
      if (reply && reply.text && msg.text) {
        const m = reply.text.match(/🆔 (\d+)/);
        if (m) {
          await send(BOT, m[1], '💬 Ответ поддержки:\n\n' + msg.text);
          await send(BOT, msg.chat.id, '✅ Ответ отправлен пользователю ' + m[1]);
        }
      }
    }

    res.status(200).json({ok:true});
  } catch (e) {
    res.status(200).json({ok:false, error: String(e)});
  }
}

async function send(token, chatId, text) {
  try {
    await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });
  } catch (e) {}
}
