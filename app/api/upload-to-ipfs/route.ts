import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";

// Mark this route for dynamic processing
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data from the request body
    const jsonData = await request.json();

    // Upload the JSON data to IPFS
    const response = await pinata.upload.json(jsonData);

    // Return the IPFS hash of the uploaded JSON data
    return NextResponse.json({ success: true, hash: response.IpfsHash });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
