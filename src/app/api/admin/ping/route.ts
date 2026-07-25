import { NextRequest, NextResponse } from "next/server"
import { isAdminTokenConfigured, isAuthorizedAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  if (!isAdminTokenConfigured()) {
    return NextResponse.json(
      { error: "Server misconfiguration." },
      { status: 500 }
    )
  }

  if (!isAuthorizedAdmin(req.headers.get("Authorization"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
