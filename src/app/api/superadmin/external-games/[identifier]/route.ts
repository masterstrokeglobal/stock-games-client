import { NextRequest, NextResponse } from "next/server";

// Using a module-level cache shared with the list route is non-trivial without a db.
// For demo only, we fake an update response.

export async function PUT(req: NextRequest, { params }: { params: { identifier: string } }) {
    const body = await req.json();
    return NextResponse.json({ data: { identifier: params.identifier, ...body } });
}


