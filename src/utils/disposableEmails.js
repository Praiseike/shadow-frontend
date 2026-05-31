/**
 * Comprehensive blocklist of known disposable / temporary email providers.
 * Checked on every registration attempt — no external API needed.
 */
const DISPOSABLE_DOMAINS = new Set([
  // ── Mailinator family ──────────────────────────────────────────────────────
  'mailinator.com', 'mailinator2.com', 'mailinator.net', 'mailinater.com',
  'suremail.info', 'chammy.info', 'tradermail.info', 'spamgourmet.com',
  // ── 10-minute / Guerrilla family ──────────────────────────────────────────
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.de',
  '10minutemail.co.uk', '10minutemail.info', '10minemail.com',
  'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamail.de', 'guerrillamail.biz',
  'guerrillamailblock.com', 'spam4.me', 'grr.la', 'sharklasers.com',
  'guerrillamailblock.com', 'yopmail.fr', 'yopmail.com',
  // ── Throwam / GuerrillaMail aliases ───────────────────────────────────────
  'throwam.com', 'throwam.net', 'spamgourmet.com', 'spamgourmet.net',
  'dispostable.com', 'tempr.email', 'discardmail.com', 'discardmail.de',
  // ── Fake / burner domains ─────────────────────────────────────────────────
  'fakeinbox.com', 'fake-box.com', 'fakemail.fr', 'fakemailgenerator.com',
  'burnermail.io', 'burnthespam.info', 'binkmail.com',
  // ── Trashmail family ──────────────────────────────────────────────────────
  'trashmail.at', 'trashmail.com', 'trashmail.io', 'trashmail.me',
  'trashmail.net', 'trashmail.org', 'trashmail.xyz', 'trashmailer.com',
  'trashcanmail.com', 'trashinbox.com', 'trashinbox.net', 'trashdevil.com',
  'trashdevil.de',
  // ── Tempmail / Temp-mail family ───────────────────────────────────────────
  'tempmail.com', 'tempmail.net', 'tempmail.org', 'tempmail.de',
  'temp-mail.com', 'temp-mail.io', 'temp-mail.org', 'temp-mail.ru',
  'temp.email', 'tempemail.com', 'tempemail.net', 'tempmail.plus',
  'tempmailo.com', 'tmpmail.net', 'tmpmail.org',
  // ── Throwaway / One-time ──────────────────────────────────────────────────
  'throwaway.email', 'throwamail.com', 'thrma.com',
  'discard.email', 'maildrop.cc', 'mailnull.com', 'mailnull.net',
  'spamfree24.org', 'spamfree24.de', 'spamfree.eu',
  // ── Jetable / Jetable.fr ──────────────────────────────────────────────────
  'jetable.com', 'jetable.fr.nf', 'jetable.net', 'jetable.org',
  'nomail.xl.cx', 'mail.mezimages.net',
  // ── Spamgourmet / Spamdecoy ───────────────────────────────────────────────
  'spamdecoy.net', 'antispam24.de', 'antispam.de',
  // ── Sharklasers / Guerrilla extensions ────────────────────────────────────
  'qqmail.com', 'crapmail.org', 'junk.to',
  // ── Maildrop / Mailsac ────────────────────────────────────────────────────
  'mailsac.com', 'mailsac.email',
  // ── Mailnesia / Mailnull ──────────────────────────────────────────────────
  'mailnesia.com', 'mailnull.com',
  // ── Yopmail ───────────────────────────────────────────────────────────────
  'yopmail.com', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf',
  // ── Mailtemp / Maildax ────────────────────────────────────────────────────
  'mailtemp.info', 'mailtemp.net', 'mailtemp.org',
  'maildax.me', 'mailnesia.com',
  // ── Sharklasers ───────────────────────────────────────────────────────────
  'sharklasers.com', 'guerrillamailblock.com',
  // ── Inboxbear / Mailbear ──────────────────────────────────────────────────
  'inboxbear.com', 'mailbear.eu',
  // ── Mohmal / One-time ─────────────────────────────────────────────────────
  'mohmal.com', 'mohmal.in',
  // ── Spam4 / Spambog ───────────────────────────────────────────────────────
  'spambog.com', 'spambog.de', 'spambog.ru',
  // ── Instant mail ─────────────────────────────────────────────────────────
  'instantemailaddress.com', 'inoutmail.de', 'inoutmail.eu',
  // ── Mailexpire ────────────────────────────────────────────────────────────
  'mailexpire.com',
  // ── CoolTempmail / Safetymail ─────────────────────────────────────────────
  'safetymail.info', 'cooldumpemail.com',
  // ── Nwldx / Spamspot ─────────────────────────────────────────────────────
  'spamspot.com', 'nwldx.com',
  // ── Getairmail / Emailondeck ──────────────────────────────────────────────
  'getairmail.com', 'emailondeck.com',
  // ── Mailpoof / Spaml ─────────────────────────────────────────────────────
  'mailpoof.com', 'spaml.com', 'spaml.de',
  // ── Harakirimail / Deadaddress ────────────────────────────────────────────
  'harakirimail.com', 'deadaddress.com',
  // ── Filzmail ─────────────────────────────────────────────────────────────
  'filzmail.com',
  // ── Mintemail ────────────────────────────────────────────────────────────
  'mintemail.com',
  // ── Fleckens ─────────────────────────────────────────────────────────────
  'fleckens.hu',
  // ── Nospamfor ────────────────────────────────────────────────────────────
  'nospamfor.us',
  // ── KillMail / Mailscrap ─────────────────────────────────────────────────
  'killmail.com', 'killmail.net', 'mailscrap.com',
  // ── Mailmoat ─────────────────────────────────────────────────────────────
  'mailmoat.com',
  // ── Spamgourmet ──────────────────────────────────────────────────────────
  'spamgourmet.net', 'spamgourmet.org',
  // ── Igelnet / Freemail ───────────────────────────────────────────────────
  'igelnet.de',
  // ── Trillianpro ──────────────────────────────────────────────────────────
  'trillianpro.com',
  // ── MyTemp / Cryptogmail ─────────────────────────────────────────────────
  'mytemp.email', 'cryptogmail.com',
  // ── Disposablemail ───────────────────────────────────────────────────────
  'disposablemail.es', 'disposablemail.com',
  // ── Mailforspam ──────────────────────────────────────────────────────────
  'mailforspam.com',
  // ── Nobulk ───────────────────────────────────────────────────────────────
  'nobulk.com',
  // ── Sogetthis ────────────────────────────────────────────────────────────
  'sogetthis.com',
  // ── Yomail ───────────────────────────────────────────────────────────────
  'yomail.info',
  // ── Wegwerfadresse ───────────────────────────────────────────────────────
  'wegwerfadresse.de', 'wegwerfmail.de', 'wegwerfmail.org', 'wegwerfmail.net',
  // ── Anonbox ──────────────────────────────────────────────────────────────
  'anonbox.net',
  // ── Maileater ────────────────────────────────────────────────────────────
  'maileater.com',
  // ── Einmalmail / Einrot ──────────────────────────────────────────────────
  'einmalmail.de', 'einrot.com', 'einrot.de',
  // ── Spam.la ──────────────────────────────────────────────────────────────
  'spam.la',
  // ── Spamfree24 ───────────────────────────────────────────────────────────
  'spamfree24.info', 'spamfree24.com',
  // ── Mailnew ──────────────────────────────────────────────────────────────
  'mailnew.com',
  // ── Dodgit ───────────────────────────────────────────────────────────────
  'dodgit.com', 'dodgit.org',
  // ── Tempinbox ────────────────────────────────────────────────────────────
  'tempinbox.com', 'tempinbox.co.uk',
  // ── Cheatmail ────────────────────────────────────────────────────────────
  'cheatmail.de',
  // ── Spamgob ──────────────────────────────────────────────────────────────
  'spamgob.com',
  // ── Mailbucket ───────────────────────────────────────────────────────────
  'mailbucket.org',
  // ── Spamoff ──────────────────────────────────────────────────────────────
  'spamoff.de',
  // ── Teleworm ─────────────────────────────────────────────────────────────
  'teleworm.com', 'teleworm.us',
  // ── Maildrom ─────────────────────────────────────────────────────────────
  'maildrom.com',
  // ── Meltmail ─────────────────────────────────────────────────────────────
  'meltmail.com',
  // ── OwlyMail ─────────────────────────────────────────────────────────────
  'owlymail.com',
  // ── Pookmail ─────────────────────────────────────────────────────────────
  'pookmail.com',
  // ── QuickInbox ───────────────────────────────────────────────────────────
  'quickinbox.com',
  // ── Recursor ─────────────────────────────────────────────────────────────
  'recursor.net',
  // ── SoMail ───────────────────────────────────────────────────────────────
  'somail.com',
  // ── Spam.email ───────────────────────────────────────────────────────────
  'spam.email', 'spam.care',
]);

/**
 * Returns true if the email uses a known disposable domain.
 * @param {string} email
 * @returns {boolean}
 */
function isDisposableEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}

export { isDisposableEmail, DISPOSABLE_DOMAINS };
