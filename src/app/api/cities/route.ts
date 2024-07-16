import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const namePrefix = searchParams.get("namePrefix");

  if (!namePrefix) {
    return NextResponse.json(
      { error: "namePrefix is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${namePrefix}&limit=5&offset=0&countryIds=IN`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
