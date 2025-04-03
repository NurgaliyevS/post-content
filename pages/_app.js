import "@/styles/globals.css";
import "@/styles/blog.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlausibleProvider from "next-plausible";
import { customConfig } from "@/project.custom.config";
import CrispChat from "@/components/CrispChat";
import { SidebarProvider } from "@/context/SidebarContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SidebarProvider>
      <PlausibleProvider domain={customConfig.domainName}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            icon={false}
          />
          <CrispChat websiteId={process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID} />
        </SessionProvider>
      </PlausibleProvider>
    </SidebarProvider>
  );
}
