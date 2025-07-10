/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import type { InteractionProps } from "react-json-view"
import { listSuppliers, saveSupplier } from "@/lib/sheets"

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false })

const NEW_SUPPLIER_TEMPLATE = {
  PROJECTS_DATA: {
    new_supplier: {
      id: "new_supplier",
      name: "",
      headerTitle: "",
      tags: [{ title: "" }, { title: "" }, { title: "" }, { title: "" }],
      statuses: [{ label: "" }, { label: "" }, { label: "" }],
      mainArticles: [
        { description: "" },
        { description: "" },
        { description: "" },
      ],
      suitable: "",
      recommendations: "",
      contacts: {
        title: "",
        name: "",
        role: "",
        email: "",
      },
      providerBlock: {
        title: "",
        iconSrc: "",
        articles: [
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
        ],
        emails: [{ title: "" }, { title: "" }],
      },
      contactBlock: {
        title: "",
      },
      slider: [{ imageSrc: "" }, { imageSrc: "" }],
    },
  },
}

function normalizeKey(obj: Record<string, any>) {
  const keys = Object.keys(obj.PROJECTS_DATA)
  if (keys.length !== 1) return obj

  const oldKey = keys[0]
  const supplierData = obj.PROJECTS_DATA[oldKey]
  const newKey = supplierData.id

  if (newKey && newKey !== oldKey) {
    obj.PROJECTS_DATA = {
      [newKey]: supplierData,
    }
  }
  return obj
}

export default function SuppliersPage() {
  const [blobs, setBlobs] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [edited, setEdited] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔄 Starting to fetch suppliers...")
    listSuppliers()
      .then((data) => {
        console.log("▶️ listSuppliers response:", data)
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
        console.error("❌ listSuppliers failed", err)
        alert("שגיאה בטעינת ספקים")
        setLoading(false)
      })
  }, [])

  const selectSupplier = (i: number) => {
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
    setEdited(JSON.parse(JSON.stringify(NEW_SUPPLIER_TEMPLATE)))
  }

  const onJsonChange = (e: InteractionProps) => {
    const updated = e.updated_src as Record<string, any>
    const ns = e.namespace

    console.log("JSON changed:", ns, e)

    if (ns.length >= 3 && ns[2] === "slider") {
      const supplierKey = Object.keys(updated.PROJECTS_DATA)[0]
      const raw = updated.PROJECTS_DATA[supplierKey].slider as any[]

      updated.PROJECTS_DATA[supplierKey].slider = raw.map((item) => {
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

    if (ns.length >= 3 && ns[2] === "tags") {
      const supplierKey = Object.keys(updated.PROJECTS_DATA)[0]
      const raw = updated.PROJECTS_DATA[supplierKey].tags as any[]

      updated.PROJECTS_DATA[supplierKey].tags = raw.map((item) => {
        if (item === null || item === undefined) {
          return { title: "" }
        }
        if (typeof item === "object" && item !== null) {
          return { title: item.title || "" }
        }
        if (typeof item === "string") {
          return { title: item }
        }
        return { title: "" }
      })
    }

    if (ns.length >= 3 && ns[2] === "statuses") {
      const supplierKey = Object.keys(updated.PROJECTS_DATA)[0]
      const raw = updated.PROJECTS_DATA[supplierKey].statuses as any[]

      updated.PROJECTS_DATA[supplierKey].statuses = raw.map((item) => {
        if (item === null || item === undefined) {
          return { label: "" }
        }
        if (typeof item === "object" && item !== null) {
          return { label: item.label || "" }
        }
        if (typeof item === "string") {
          return { label: item }
        }
        return { label: "" }
      })
    }

    if (ns.length >= 3 && ns[2] === "mainArticles") {
      const supplierKey = Object.keys(updated.PROJECTS_DATA)[0]
      const raw = updated.PROJECTS_DATA[supplierKey].mainArticles as any[]

      updated.PROJECTS_DATA[supplierKey].mainArticles = raw.map((item) => {
        if (item === null || item === undefined) {
          return { description: "" }
        }
        if (typeof item === "object" && item !== null) {
          return { description: item.description || "" }
        }
        if (typeof item === "string") {
          return { description: item }
        }
        return { description: "" }
      })
    }

    if (ns.length >= 4 && ns[2] === "providerBlock" && ns[3] === "articles") {
      const supplierKey = Object.keys(updated.PROJECTS_DATA)[0]
      const raw = updated.PROJECTS_DATA[supplierKey].providerBlock
        .articles as any[]

      updated.PROJECTS_DATA[supplierKey].providerBlock.articles = raw.map(
        (item) => {
          if (item === null || item === undefined) {
            return { title: "", description: "" }
          }
          if (typeof item === "object" && item !== null) {
            return {
              title: item.title || "",
              description: item.description || "",
            }
          }
          return { title: "", description: "" }
        }
      )
    }

    if (ns.length >= 4 && ns[2] === "providerBlock" && ns[3] === "emails") {
      const supplierKey = Object.keys(updated.PROJECTS_DATA)[0]
      const raw = updated.PROJECTS_DATA[supplierKey].providerBlock
        .emails as any[]

      updated.PROJECTS_DATA[supplierKey].providerBlock.emails = raw.map(
        (item) => {
          if (item === null || item === undefined) {
            return { title: "" }
          }
          if (typeof item === "object" && item !== null) {
            return { title: item.title || "" }
          }
          if (typeof item === "string") {
            return { title: item }
          }
          return { title: "" }
        }
      )
    }

    if (ns.length >= 3 && ns[2] === "id") {
      const oldKey = Object.keys(updated.PROJECTS_DATA)[0]
      const newId = updated.PROJECTS_DATA[oldKey].id

      if (newId && newId !== oldKey) {
        const supplierData = updated.PROJECTS_DATA[oldKey]
        updated.PROJECTS_DATA = {
          [newId]: supplierData,
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
      const { row } = await saveSupplier(normalized, rowArg)

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
      console.error("❌ saveSupplier failed", err)
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
        <p>טוען ספקים...</p>
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
          + ספק חדש
        </button>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {blobs.length === 0 ? (
            <li style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
              {loading ? "טוען..." : "אין ספקים"}
            </li>
          ) : (
            blobs.map((b, i) => {
              let name = `ספק ${i + 1}`
              let hasError = false

              try {
                console.log(`🔍 Parsing blob ${i}:`, b)
                const obj = JSON.parse(b)
                console.log(`📋 Parsed object ${i}:`, obj)

                if (obj.PROJECTS_DATA) {
                  const supplierData = Object.values(
                    obj.PROJECTS_DATA
                  )[0] as any
                  name = supplierData.name || `ספק ${i + 1}`
                  console.log(`📝 Supplier ${i} name:`, name)
                } else {
                  console.warn(`⚠️ No PROJECTS_DATA in blob ${i}`)
                }
              } catch (err) {
                console.error(`❌ Failed to parse blob ${i}:`, err)
                hasError = true
                name = `ספק ${i + 1} (שגיאה)`
              }

              return (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <button
                    onClick={() => selectSupplier(i)}
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
            בחר ספק מהצד או לחץ על &quot;+ ספק חדש&quot; כדי להתחיל
          </p>
        )}
      </main>
    </div>
  )
}
