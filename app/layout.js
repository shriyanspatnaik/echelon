import { Nunito } from "next/font/google";
import "./globals.css";

// Nunito is the ultimate rounded, inviting consumer app font
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata = {
  title: "VocalForLocal",
  description: "Your neighborhood, delivered.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
