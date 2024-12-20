import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <Header>
          {" "}
          <SidebarTrigger />
        </Header>
        <AppSidebar />
        <div className="mt-[--header-height] w-full">
          <div className="w-full">
            <main className="w-full">
              <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
