import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { CssBaseline, Stack } from "@mui/material"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function TableLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>   
        <Stack component='main' flex='1' overflow={"hidden"} position="relative" >
          {children}
        </Stack>
      </>
  )
}
