import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex flex-col justify-center items-center gap-4'>
      <h1>This is the admin dashboard </h1>
      <br />
      <Link href="/">Back to login</Link>
    </div>
  )
}
