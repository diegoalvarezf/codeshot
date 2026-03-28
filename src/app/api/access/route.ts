export async function POST(req: Request) {
  const { code } = await req.json();

  if (!process.env.ACCESS_CODE) {
    return new Response(null, { status: 200 });
  }

  if (code === process.env.ACCESS_CODE) {
    return new Response(null, { status: 200 });
  }

  return new Response(null, { status: 401 });
}
