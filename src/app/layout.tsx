import "./globals.css"

export const metadata = {
  title: "לוח בקרה",
  description: "עריכת כלים וספקים",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          background: "#fff",
          color: "#000",
        }}
      >
        {children}
      </body>
    </html>
  )
}
