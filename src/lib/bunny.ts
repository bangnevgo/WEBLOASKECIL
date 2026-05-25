import crypto from 'crypto'

/**
 * Generate a signed URL for secure file delivery via Bunny.net CDN.
 * Uses Advanced Token Authentication (HMAC-SHA256).
 * 
 * @param url The full CDN URL (e.g., https://myzone.b-cdn.net/meditations/sats.mp3)
 * @param securityKey The Token Authentication Key from the Pull Zone settings
 * @param expirationSeconds Expiry duration in seconds (default 86400 / 24 hours)
 * @param userIp Optional client IP to bind the token access to
 * @param isDirectory Optional flag, set true for directory-level token (HLS playlists)
 */
export function signBunnyUrl(
  url: string,
  securityKey: string,
  expirationSeconds: number = 86400,
  userIp: string = '',
  isDirectory: boolean = false
): string {
  try {
    const expires = Math.floor(Date.now() / 1000) + expirationSeconds
    const parsedUrl = new URL(url)
    const signaturePath = parsedUrl.pathname

    // Concatenate according to Bunny.net Advanced signature format:
    // securityKey + path + expires + (userIp)
    const hashableBase = securityKey + signaturePath + expires + userIp

    const hmac = crypto.createHmac('sha256', securityKey)
    hmac.update(hashableBase)
    const signature = hmac.digest('base64')

    // Convert Base64 output to URL-safe format (base64url)
    const token = signature
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    if (isDirectory) {
      // Directory token format (used for HLS streams .m3u8):
      // https://pullzone.b-cdn.net/bcdn_token=TOKEN&expires=EXPIRES/path/to/media
      return `${parsedUrl.origin}/bcdn_token=${token}&expires=${expires}${signaturePath}`
    } else {
      // Query string token format (used for static files PDF, MP3):
      // https://pullzone.b-cdn.net/path/to/media?token=TOKEN&expires=EXPIRES
      const separator = parsedUrl.search ? '&' : '?'
      return `${url}${separator}token=${token}&expires=${expires}`
    }
  } catch (error) {
    console.error('Error signing Bunny.net URL:', error)
    return url
  }
}
