// app/layout.tsx (root layout)
import "@/styles/globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Providers from "@/providers/Providers";
import Navbar from "@/components/Navbar";
import AuthClientInit from "@/components/AuthClientInit"; // 👈 клієнтська логіка

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token =  (await cookies()).get("token")?.value;


  if (!token) {
    redirect("/auth/login");
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="_container">
            <AuthClientInit />
            <Navbar />
            <div>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
