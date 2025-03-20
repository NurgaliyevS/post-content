import "@/styles/globals.css";
import "@/styles/blog.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlausibleProvider from "next-plausible";
import { customConfig } from "@/project.custom.config";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // example as RedditScheduler.com without https://
    <PlausibleProvider domain={customConfig.domainName}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </SessionProvider>
    </PlausibleProvider>
  );
}
