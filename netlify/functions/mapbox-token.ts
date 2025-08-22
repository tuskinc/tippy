/**
 * Serverless function that returns the Mapbox access token stored in an
 * environment variable. This keeps the real token off of the client bundle
 * while still allowing the front-end to obtain it dynamically at runtime.
 *
 * Set the variable in Netlify / Render / Vercel dashboard or in an `.env`
 * file *outside* the React build so it is not shipped to the browser.
 */
export const handler = async () => {
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

  if (!MAPBOX_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MAPBOX_ACCESS_TOKEN not configured' }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // cache for 1 hour
    },
    body: JSON.stringify({ token: MAPBOX_TOKEN }),
  };
};
