// import ContextProvider from "./context";
import Initiator from "./initiator";

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
        <div>{children}</div>
      </body>
    </html>
  );
}
