import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params
    const videoPath = path.join('/')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

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
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        const contentType = response.headers.get('content-type') || 'video/mp4'
        const contentLength = response.headers.get('content-length')
        const contentRange = response.headers.get('content-range')
        const acceptRanges = response.headers.get('accept-ranges')

        // Stream the response
        const responseHeaders: Record<string, string> = {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
            'Accept-Ranges': acceptRanges || 'bytes',
        }

        if (contentLength) {
            responseHeaders['Content-Length'] = contentLength
        }
        if (contentRange) {
            responseHeaders['Content-Range'] = contentRange
        }

        return new NextResponse(response.body, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch (error) {
        console.error('Video proxy error:', error)
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
    }
}
