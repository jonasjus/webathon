import { NextResponse } from "next/server";
import { reverseGeocodeCoordinates } from "@/lib/geocoding";
import { hasValidCoordinates } from "@/lib/map";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!hasValidCoordinates({ lat, lng })) {
    return NextResponse.json(
      { error: "Mangler gyldige koordinater." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const result = await reverseGeocodeCoordinates({ lat, lng });

    if (!result) {
      return NextResponse.json(
        { error: "Fant ingen adresse for punktet." },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("[map] reverse geocoding failed", error);

    return NextResponse.json(
      { error: "Karttjenesten svarte ikke. Prøv igjen om litt." },
      { status: 502, headers: NO_STORE_HEADERS }
    );
  }
}
