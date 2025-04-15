import "@/styles/globals.css";
import "@/styles/blog.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CrispChat from "@/components/CrispChat";
import { SidebarProvider } from "@/context/SidebarContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SidebarProvider>
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
      <script
        defer
        data-website-id="67fe2d2d76d3bb08964458c8"
        data-domain="post-content.com"
        src="https://datafa.st/js/script.js"
      ></script>
    </SidebarProvider>
  );
}
