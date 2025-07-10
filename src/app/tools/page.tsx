/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import type { InteractionProps } from "react-json-view"
import { listTools, saveTool } from "@/lib/sheets"

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false })

const NEW_TOOL_TEMPLATE = {
  TOOLS_DATA: {
    new_tool: {
      id: "new_tool",
      name: "",
      headerTitle: "",
      solutions: [{ title: "" }, { title: "" }],
      mainArticles: Array(5).fill({ description: "" }),
      providerBlock: {
        title: "",
        provider: "",
        label: "",
        iconSrc: "",
        description: "",
        adress: "",
        phone: "",
        email: "",
      },
      contactBlock: { title: "" },
      slider: [{ imageSrc: "" }, { imageSrc: "" }],
    },
  },
}

function normalizeKey(obj: Record<string, any>) {
  const keys = Object.keys(obj.TOOLS_DATA)
  if (keys.length !== 1) return obj

  const oldKey = keys[0]
  const toolData = obj.TOOLS_DATA[oldKey]
  const newKey = toolData.id

  if (newKey && newKey !== oldKey) {
    obj.TOOLS_DATA = {
      [newKey]: toolData,
    }
  }
  return obj
}

export default function ToolsPage() {
  const [blobs, setBlobs] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [edited, setEdited] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔄 Starting to fetch tools...")
    listTools()
      .then((data) => {
        console.log("▶️ listTools response:", data)
        console.log("▶️ data type:", typeof data)
        console.log("▶️ is array:", Array.isArray(data))
        console.log("▶️ length:", data?.length)

        if (Array.isArray(data)) {
          setBlobs(data)
          console.log("✅ Blobs set successfully, count:", data.length)
        } else {
          console.error("❌ Expected array but got:", typeof data)
          setBlobs([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("❌ listTools failed", err)
        alert("שגיאה בטעינת כלים")
        setLoading(false)
      })
  }, [])

  const selectTool = (i: number) => {
    setSelectedIdx(i)
    try {
      const parsed = JSON.parse(blobs[i])
      setEdited(parsed)
    } catch (err) {
      console.error("Failed to parse JSON:", err)
      alert("שגיאה בפענוח הנתונים")
    }
  }

  const addNew = () => {
    setSelectedIdx(null)
    setEdited(JSON.parse(JSON.stringify(NEW_TOOL_TEMPLATE)))
  }

  const onJsonChange = (e: InteractionProps) => {
    const updated = e.updated_src as Record<string, any>
    const ns = e.namespace

    console.log("JSON changed:", ns, e)

    if (ns.length >= 3 && ns[2] === "slider") {
      const toolKey = Object.keys(updated.TOOLS_DATA)[0]
      const raw = updated.TOOLS_DATA[toolKey].slider as any[]

      updated.TOOLS_DATA[toolKey].slider = raw.map((item) => {
        if (item === null || item === undefined) {
          return { imageSrc: "" }
        }
        if (typeof item === "object" && item !== null) {
          return { imageSrc: item.imageSrc || "" }
        }
        if (typeof item === "string") {
          return { imageSrc: item }
        }
        return { imageSrc: "" }
      })
    }

    if (
      e.name === "slider" &&
      (e.new_value !== undefined || e.existing_value !== undefined)
    ) {
      const toolKey = Object.keys(updated.TOOLS_DATA)[0]
      if (updated.TOOLS_DATA[toolKey].slider) {
        updated.TOOLS_DATA[toolKey].slider = updated.TOOLS_DATA[
          toolKey
        ].slider.map((item: any) => {
          if (item === null || item === undefined) {
            return { imageSrc: "" }
          }
          if (typeof item === "object" && item !== null) {
            return { imageSrc: item.imageSrc || "" }
          }
          return { imageSrc: "" }
        })
      }
    }

    if (ns.length >= 3 && ns[2] === "id") {
      const oldKey = Object.keys(updated.TOOLS_DATA)[0]
      const newId = updated.TOOLS_DATA[oldKey].id

      if (newId && newId !== oldKey) {
        const toolData = updated.TOOLS_DATA[oldKey]
        updated.TOOLS_DATA = {
          [newId]: toolData,
        }
      }
    }

    setEdited(updated)
  }

  const onSave = async () => {
    if (!edited) return alert("אין מה לשמור")

    const normalized = normalizeKey(JSON.parse(JSON.stringify(edited)))

    try {
      const rowArg = selectedIdx !== null ? selectedIdx + 2 : undefined
      const { row } = await saveTool(normalized, rowArg)

      setBlobs((prev) => {
        const copy = [...prev]
        copy[row - 2] = JSON.stringify(normalized)
        return copy
      })

      if (selectedIdx === null) {
        setSelectedIdx(row - 2)
      }

      setEdited(normalized)

      alert(`נשמר בשורה ${row}`)
    } catch (err) {
      console.error("❌ saveTool failed", err)
      alert("שגיאה בשמירה")
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>טוען כלים...</p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff" }}>
      <aside
        style={{
          width: 260,
          padding: "1rem",
          borderLeft: "1px solid #ddd",
          overflowY: "auto",
          background: "#f7f7f7",
          direction: "rtl",
        }}
      >
        <Link href="/" style={{ display: "block", marginBottom: "1rem" }}>
          ← חזרה
        </Link>

        <button
          onClick={addNew}
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.5rem",
            fontSize: "1rem",
          }}
        >
          + כלי חדש
        </button>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {blobs.length === 0 ? (
            <li style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
              {loading ? "טוען..." : "אין כלים"}
            </li>
          ) : (
            blobs.map((b, i) => {
              let name = `כלי ${i + 1}`
              let hasError = false

              try {
                console.log(`🔍 Parsing blob ${i}:`, b)
                const obj = JSON.parse(b)
                console.log(`📋 Parsed object ${i}:`, obj)

                if (obj.TOOLS_DATA) {
                  const toolData = Object.values(obj.TOOLS_DATA)[0] as any
                  name = toolData.name || `כלי ${i + 1}`
                  console.log(`📝 Tool ${i} name:`, name)
                } else {
                  console.warn(`⚠️ No TOOLS_DATA in blob ${i}`)
                }
              } catch (err) {
                console.error(`❌ Failed to parse blob ${i}:`, err)
                hasError = true
                name = `כלי ${i + 1} (שגיאה)`
              }

              return (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <button
                    onClick={() => selectTool(i)}
                    style={{
                      width: "100%",
                      textAlign: "right",
                      background: i === selectedIdx ? "#e0e0e0" : "transparent",
                      padding: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      color: hasError ? "#ff0000" : "#000",
                    }}
                  >
                    {name}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </aside>

      <main style={{ flex: 1, padding: "1rem", overflow: "auto" }}>
        {edited !== null ? (
          <>
            <ReactJson
              src={edited}
              enableClipboard={false}
              onEdit={onJsonChange}
              onAdd={onJsonChange}
              onDelete={onJsonChange}
              collapsed={false}
              displayDataTypes={false}
              displayObjectSize={false}
            />
            <button
              onClick={onSave}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
              }}
            >
              שמור
            </button>
          </>
        ) : (
          <p style={{ fontSize: "1.1rem" }}>
            בחר כלי מהצד או לחץ על &quot;+ כלי חדש&quot; כדי להתחיל
          </p>
        )}
      </main>
    </div>
  )
}
