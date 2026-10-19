import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/session";
import type { Result, CompaniesHouseResponse, SearchResult } from "@/types";

const MIN_QUERY_LENGTH = 2; // keep in sync with the picker
const MAX_QUERY_LENGTH = 50;

//? Small helper so every response has the Result shape plus a status code
function respond(body: Result<SearchResult[]>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return respond({ success: false, error: "Not authenticated" }, 401);
  }

  const searchQuery = (request.nextUrl.searchParams.get("q") ?? "")
    .trim()
    .slice(0, MAX_QUERY_LENGTH);

  if (searchQuery.length < MIN_QUERY_LENGTH)
    return respond({ success: true, data: [] });

  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  if (!apiKey) {
    console.error("COMPANIES_HOUSE_API_KEY is not set");
    return respond(
      { success: false, error: "Company search is unavailable" },
      500,
    );
  }

  try {
    //? Ask for 20 so dissolved companies don't use up the 5 slots we keep
    const params = new URLSearchParams({
      q: searchQuery,
      items_per_page: "5",
    });

    const res = await fetch(
      `https://api.company-information.service.gov.uk/search/companies?${params}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        },
      },
    );

    //? Treat "not found" as "no matches", not as an error
    if (res.status === 404) return respond({ success: true, data: [] });

    if (!res.ok) {
      console.error("Companies House search failed:", res.status);
      return respond({ success: false, error: "Company search failed" }, 502);
    }

    const data: CompaniesHouseResponse = await res.json();

    const results = data.items.map((item) => ({
      name: item.title,
      companyNumber: item.company_number,
      location: item.address?.locality,
    }));

    return respond({ success: true, data: results });
  } catch (error) {
    console.error("Companies House search error:", error);
    return respond({ success: false, error: "Company search failed" }, 500);
  }
}
