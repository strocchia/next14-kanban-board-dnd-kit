import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import TaskProvider from "@/lib/task-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // title: 'Create Next App',
  title: "My Kanban DnD Board",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ConvexClientProvider>
        <TaskProvider>
          <body className={inter.className}>{children}</body>
        </TaskProvider>
      </ConvexClientProvider>
    </html>
  );
}
