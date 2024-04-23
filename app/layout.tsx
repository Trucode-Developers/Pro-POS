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
        <div className="absolute top-0 right-0">
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
