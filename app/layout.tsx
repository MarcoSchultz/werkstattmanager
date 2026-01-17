import "./globals.css";
import Sidebar from "./sidebar";

export const metadata = {
  title: "Werkstattmanager",
  description: "Werkstattmanager Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          margin: 0,
          background: "#f9fafb",
        }}
      >
        <Sidebar />

        <main style={{ flex: 1, padding: "20px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}