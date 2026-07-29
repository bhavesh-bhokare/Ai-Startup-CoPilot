import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
variable: "--font-cormorant",
subsets: ["latin"],
weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
variable: "--font-manrope",
subsets: ["latin"],
weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
title: "AI Startup Co-Pilot",
description: "Your AI co-pilot for smarter startup decisions.",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return( <html lang="en">
<body className={`${cormorant.variable} ${manrope.variable}`}>
{children} </body> </html>
);
}
