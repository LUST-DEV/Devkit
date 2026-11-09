const GUIDES: Readonly<Record<string, readonly string[]>> = {
  json: [
    'Paste or type JSON in the input.',
    'Choose Format (2 spaces, 4 spaces or tabs) or Minify.',
    'Errors show the line and column when the browser reports them.',
  ],
  base64: [
    'Pick Encode or Decode.',
    'Unicode text is supported. Tick URL-safe to use - and _ without padding.',
    'When decoding, spaces and line breaks are ignored and missing padding is accepted.',
  ],
  uuid: [
    'Choose how many UUIDs you need, from 1 to 1000.',
    'Turn uppercase or hyphens on or off, then press Generate.',
    'Values come from the secure random source of your browser.',
  ],
  jwt: [
    'Paste a token, with or without the Bearer prefix.',
    'The header, the payload and the time claims are decoded in your browser.',
    'The signature is never verified: do not trust a token from this view alone.',
  ],
  timestamp: [
    'Type a number of seconds or milliseconds, or a date.',
    'Choose the time zone and the regional format.',
    'A date without an offset is read in the selected time zone. Use Now to fill the current time.',
  ],
  hash: [
    'Choose SHA-256, SHA-384 or SHA-512.',
    'The hash updates as you type.',
    'Text is hashed as UTF-8 with the Web Crypto API.',
  ],
}

export function getToolGuide(toolId: string): readonly string[] {
  return GUIDES[toolId] ?? ['Type or paste your input, then read the result below.']
}
