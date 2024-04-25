// import ContextProvider from "./context";
import Initiator from "./initiator";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //check Initiator to check token
  return (
    <html lang="en">
      <body>
        <Initiator />
        <Toaster richColors />
        <div>{children}</div>
      </body>
    </html>
  );
}
