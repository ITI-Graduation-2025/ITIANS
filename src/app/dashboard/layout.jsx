import { Inter } from "next/font/google";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SiteHeader } from "@/components/site-header";
import NextProvider from "@/components/providers/nextProvider";
import { UsersProvider } from "@/context/usersContext";
import { getAllUsers, getUser } from "@/services/userServices";
import "./dasboardColors.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ITI Admin Dashboard",
  description: "Admin dashboard for ITI Freelance & Mentorship Platform",
};

export default async function RootLayout({ children }) {
  const users = await getAllUsers();
  console.log(users);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider
            style={{
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            }}
          >
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <UsersProvider initialUsers={users}>
                      {children}
                    </UsersProvider>
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
