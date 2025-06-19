import Link from 'next/link'
import React from 'react'
import Avatar from './Avatar'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

function Header() {
  return (
    <header className='bg-white shadow-sm text-gray-800 flex justify-between px-5 py-3'>
        <Link href={'/'} className='flex items-center justify-center text-2xl font-thin gap-3'>
            {/* Avatar */}
            <Avatar 
                seed='SanjuBOT'
            />
            <div className='space-y-1'>
                <h1>SanjuBOT</h1>
                <h2 className='text-sm'>Your customizable AI chatbot</h2>  
            </div>
        </Link>
        <div className='flex items-center'>
            <SignedIn>
                <UserButton showName />
            </SignedIn>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </div>
    </header>
  )
}

export default Header