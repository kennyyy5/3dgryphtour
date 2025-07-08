// /app/api/geocode/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return Response.json({ error: "Missing address" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return Response.json(data);
}
