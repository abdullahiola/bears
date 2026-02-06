import { NextRequest } from 'next/server'

// Use Edge runtime for streaming support and no body size limit
export const runtime = 'edge'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params
    const videoPath = path.join('/')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

    try {
        // Forward range header for video streaming
        const headers: HeadersInit = {
            'ngrok-skip-browser-warning': 'true',
        }

        const rangeHeader = request.headers.get('range')
        if (rangeHeader) {
            headers['Range'] = rangeHeader
        }

        const response = await fetch(`${apiUrl}/videos/${videoPath}`, { headers })

        if (!response.ok && response.status !== 206) {
            return new Response(JSON.stringify({ error: 'Video not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Stream the response directly (Edge runtime supports this)
        const responseHeaders = new Headers()
        responseHeaders.set('Content-Type', response.headers.get('content-type') || 'video/mp4')
        responseHeaders.set('Accept-Ranges', 'bytes')
        responseHeaders.set('Cache-Control', 'public, max-age=3600')

        const contentLength = response.headers.get('content-length')
        const contentRange = response.headers.get('content-range')

        if (contentLength) responseHeaders.set('Content-Length', contentLength)
        if (contentRange) responseHeaders.set('Content-Range', contentRange)

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch (error) {
        console.error('Video proxy error:', error)
        return new Response(JSON.stringify({ error: 'Failed to fetch video' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
