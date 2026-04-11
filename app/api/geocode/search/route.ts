import { NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocoding";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { error: "Skriv inn en adresse først." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const result = await geocodeAddress(query);

    if (!result) {
      return NextResponse.json(
        { error: "Fant ingen adresse som kunne plasseres på kartet." },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("[map] forward geocoding failed", error);

    return NextResponse.json(
      { error: "Karttjenesten svarte ikke. Prøv igjen om litt." },
      { status: 502, headers: NO_STORE_HEADERS }
    );
  }
}
