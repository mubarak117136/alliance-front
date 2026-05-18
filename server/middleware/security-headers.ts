export default defineEventHandler((event) => {
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  setHeader(event, 'Content-Security-Policy', "frame-ancestors 'self'")
  setHeader(event, 'Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  setHeader(event, 'X-XSS-Protection', '1; mode=block')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
})
