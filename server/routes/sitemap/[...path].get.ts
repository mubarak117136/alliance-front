export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')

  if (!path) {
    setResponseStatus(event, 400)
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return 'Bad Request: Missing sitemap path'
  }

  const upstreamUrl = `${config.public.HOST}/sitemap/${path}`

  try {
    const response = await fetch(upstreamUrl)

    setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

    if (!response.ok) {
      setResponseStatus(event, response.status)
      setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
      return await response.text()
    }

    setResponseHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return await response.text()
  } catch {
    setResponseStatus(event, 502)
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return 'Bad Gateway: Failed to fetch upstream sitemap'
  }
})
