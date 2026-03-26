import { Oxanium, Merriweather, Fira_Code } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const oxanium = Oxanium({
  variable: "--font-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Razvi Rental Management",
  description: "Landlord rental management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${oxanium.variable} ${merriweather.variable} ${firaCode.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground [&_svg]:stroke-[1.75]">
        <ThemeProvider>
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster position="bottom-right" theme="system" richColors closeButton duration={4000} />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
