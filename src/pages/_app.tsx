import '@/styles/globals.css'
import '@/styles/custom.css'
import type { AppProps } from 'next/app'
import { useState } from 'react';
import { ThemeContext } from "@/components/themeContext";

export default function App({ Component, pageProps }: AppProps) {
   const [theme, setTheme] = useState({
     primary: "#1a1a1a",
     secondary: "#1a1a1a",
     text: "#1a1a1a",
     tertiary: "#1a1a1a",
   });

   
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}
