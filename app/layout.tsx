// import ContextProvider from "./context";
import Initiator from "./initiator";
import { Toaster } from "sonner";
import Server from "./server";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //check Initiator to check token
  return (
    <html lang="en">
      <body className="relative h-screen overflow-hidden">
        <Server />
        <div className="min-h-screen mainBgImage" />
        <div className="absolute top-0 z-10 w-full text-black">
          <Initiator />
          <Toaster richColors />
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
