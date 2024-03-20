// import ContextProvider from "./context";
import Initiator from "./initiator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Initiator />
        <div>{children}</div>
      </body>
    </html>
  );
}
