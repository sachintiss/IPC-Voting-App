import "./globals.css";

export const metadata = {
  title: "Junior PPG Batch – IPC Election 2026",
  description: "Junior PPG Batch IPC Election 2026"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
