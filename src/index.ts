import { AutoRouter, cors } from 'itty-router';
import { getCookie } from './cookies';

// get preflight and corsify pair
const { preflight, corsify } = cors({
  origin: "*",
  credentials: true,
});

const router = AutoRouter({
    before: [preflight],  // add preflight upstream
    finally: [corsify],   // and corsify downstream
});

router.get('/set', async (request, env: Env) => {
  const origin = request.headers.get('origin');
  const headers = new Headers();

  if(!origin) {
    return new Response('No origin header found', { status: 400 });
  }

  const maxAge = 60 * 60 * 24; // 1 day in seconds
  headers.set('Set-Cookie', `callback=${encodeURIComponent(origin)}; Path=/; HttpOnly; Max-Age=${maxAge}; Secure; SameSite=None`);  
  return new Response('A cookie with the callback url has been set: ' + origin, { headers })
});

router.get('/callback/*', async (request, ) => {
  const callbackUrl = getCookie(request, 'callback');

  if (!callbackUrl) {
    return new Response('No callback URL found in cookies', { status: 400 });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace('/callback', '');
  const params = url.search;

  const newLocation = decodeURIComponent(callbackUrl) + path + params;

  const headers = new Headers();
  headers.set('Location', newLocation);

  return new Response(null, { status: 302, headers });
});

export default router;