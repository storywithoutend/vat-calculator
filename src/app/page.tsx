"use client"

import { MainView } from "@/components/views/MainView/MainView"
import { Providers } from "@/components/providers/Providers"

export default function Home() {
  return (
    <Providers>
      <MainView />
    </Providers>
  )
}
