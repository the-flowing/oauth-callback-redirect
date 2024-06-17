import { IRequest } from "itty-router"

// Function to parse cookies from the request headers
export function getCookie(request: IRequest, name: string): string | null {
    const cookies = request.headers.get('Cookie')
    if (cookies) {
      const cookieArray = cookies.split(';').map(cookie => cookie.trim())
      for (const cookie of cookieArray) {
        const [cookieName, cookieValue] = cookie.split('=')
        if (cookieName === name) {
          return cookieValue
        }
      }
    }
    return null
  }