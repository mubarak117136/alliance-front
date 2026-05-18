export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const upstreamUrl = `${config.public.HOST}/robots.txt`

  try {
    const response = await fetch(upstreamUrl)

    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

    if (!response.ok) {
      setResponseStatus(event, response.status)
      return await response.text()
    }

    setResponseHeader(event, 'Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    return await response.text()
  } catch {
    setResponseStatus(event, 502)
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return 'Bad Gateway: Failed to fetch robots.txt'
  }
})
