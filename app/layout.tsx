import "./globals.css";
import AuthWrapper from "./auth-wrapper";

export const metadata = {
  title: "Werkstattmanager",
  description: "Werkstattverwaltung für Fahrzeuge, Kunden und Reparaturen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="flex">
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
