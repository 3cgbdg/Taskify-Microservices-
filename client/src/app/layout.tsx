import "@/styles/globals.css";
import Providers from "@/providers/Providers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Taskify",
  description: "task app",
  icons: {
    icon: '/logo.ico'
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
