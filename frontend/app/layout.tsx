import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

export const metadata: Metadata = {
    title: "MangaVerse - اقرأ المانجا والمانهوا",
    description: "موقع عربي لقراءة وترجمة المانجا والمانهوا أونلاين مجاناً",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
