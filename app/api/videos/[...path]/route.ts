import { NextRequest, NextResponse } from 'next/server'

// Use Node.js runtime for localhost access during development
export const runtime = 'nodejs'
// Disable Next.js body parsing to allow video streaming
export const dynamic = 'force-dynamic'

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
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        // Get the video data as an ArrayBuffer
        const videoBuffer = await response.arrayBuffer()

        // Build response headers
        const responseHeaders = new Headers()
        responseHeaders.set('Content-Type', response.headers.get('content-type') || 'video/mp4')
        responseHeaders.set('Accept-Ranges', 'bytes')
        responseHeaders.set('Cache-Control', 'public, max-age=3600')
        responseHeaders.set('Content-Length', videoBuffer.byteLength.toString())

        const contentRange = response.headers.get('content-range')
        if (contentRange) responseHeaders.set('Content-Range', contentRange)

        return new NextResponse(videoBuffer, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch (error) {
        console.error('Video proxy error:', error)
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
    }
}
