import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "TBB ASOCIADOS",
  description: "App Video Conferencia",
  icons:{
    icon :"/icons/logo.svg"
  }
};
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
        <StreamVideoProvider>
        {children}
        </StreamVideoProvider>
        
    </main>
  )
}

export default RootLayout