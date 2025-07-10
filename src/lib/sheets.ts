/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE = "/api/tools"
const SUPPLIERS_BASE = "/api/suppliers"

export async function listTools(): Promise<string[]> {
  const url = `${BASE}?action=list`
  console.log("📡 Fetching tools from:", url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log("📡 Response status:", res.status)
    console.log(
      "📡 Response headers:",
      Object.fromEntries(res.headers.entries())
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ Response not OK:", errorText)
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    const responseText = await res.text()
    console.log("✅ Raw response:", responseText)

    let json
    try {
      json = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError)
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    if (json.error) {
      throw new Error(`Server error: ${json.error}`)
    }

    if (!Array.isArray(json)) {
      throw new Error(`Expected array but got ${typeof json}`)
    }

    return json
  } catch (error) {
    console.error("❌ listTools error:", error)
    throw error
  }
}

export async function saveTool(
  data: any,
  row?: number
): Promise<{ ok: boolean; row: number }> {
  console.log("💾 Saving tool:", data, "to row:", row)

  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ data, row: row ?? null, type: "suppliers" }),
    })

    console.log("💾 Save response status:", res.status)

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ Save failed:", errorText)
      throw new Error(`Save failed: ${res.status} - ${errorText}`)
    }

    const responseText = await res.text()
    console.log("✅ Save raw response:", responseText)

    const json = JSON.parse(responseText)
    console.log("✅ Save parsed response:", json)

    if (json.error) {
      throw new Error(`Server error: ${json.error}`)
    }

    return json
  } catch (error) {
    console.error("❌ saveTool error:", error)
    throw error
  }
}

export async function listSuppliers(): Promise<string[]> {
  const url = `${SUPPLIERS_BASE}?action=list&type=suppliers`
  console.log("📡 Fetching suppliers from:", url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log("📡 Response status:", res.status)
    console.log(
      "📡 Response headers:",
      Object.fromEntries(res.headers.entries())
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ Response not OK:", errorText)
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    const responseText = await res.text()
    console.log("✅ Raw response:", responseText)

    let json
    try {
      json = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError)
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    if (json.error) {
      throw new Error(`Server error: ${json.error}`)
    }

    if (!Array.isArray(json)) {
      throw new Error(`Expected array but got ${typeof json}`)
    }

    return json
  } catch (error) {
    console.error("❌ listSuppliers error:", error)
    throw error
  }
}

export async function saveSupplier(
  data: any,
  row?: number
): Promise<{ ok: boolean; row: number }> {
  console.log("💾 Saving supplier:", data, "to row:", row)

  try {
    const res = await fetch(SUPPLIERS_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ data, row: row ?? null }),
    })

    console.log("💾 Save response status:", res.status)

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ Save failed:", errorText)
      throw new Error(`Save failed: ${res.status} - ${errorText}`)
    }

    const responseText = await res.text()
    console.log("✅ Save raw response:", responseText)

    const json = JSON.parse(responseText)
    console.log("✅ Save parsed response:", json)

    if (json.error) {
      throw new Error(`Server error: ${json.error}`)
    }

    return json
  } catch (error) {
    console.error("❌ saveSupplier error:", error)
    throw error
  }
}
