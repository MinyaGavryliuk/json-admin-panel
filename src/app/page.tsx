import Link from "next/link"

export default function Home() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>ברוכים הבאים ללוח הבקרה</h1>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "1.25rem" }}>
        <li style={{ margin: "0.5rem 0" }}>
          <Link href="/tools">כלים</Link>
        </li>
        <li style={{ margin: "0.5rem 0" }}>
          <Link href="/suppliers">ספקים</Link>
        </li>
      </ul>
    </main>
  )
}
