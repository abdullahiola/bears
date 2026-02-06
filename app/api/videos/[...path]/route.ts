import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params
    const videoPath = path.join('/')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

    console.log(`Proxying video: ${apiUrl}/videos/${videoPath}`)

    try {
        // Forward range header for video streaming
        const headers: Record<string, string> = {
            'ngrok-skip-browser-warning': 'true',
        }

        const rangeHeader = request.headers.get('range')
        if (rangeHeader) {
            headers['Range'] = rangeHeader
        }

        const response = await fetch(`${apiUrl}/videos/${videoPath}`, { headers })

        if (!response.ok && response.status !== 206) {
            console.error(`Video fetch failed: ${response.status}`)
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        const contentType = response.headers.get('content-type') || 'video/mp4'
        const contentLength = response.headers.get('content-length')
        const contentRange = response.headers.get('content-range')

        // For Vercel, we need to buffer the response
        const buffer = await response.arrayBuffer()

        const responseHeaders: Record<string, string> = {
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=3600',
        }

        if (contentLength) {
            responseHeaders['Content-Length'] = contentLength
        }
        if (contentRange) {
            responseHeaders['Content-Range'] = contentRange
        }

        return new NextResponse(buffer, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch (error) {
        console.error('Video proxy error:', error)
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
    }
}
