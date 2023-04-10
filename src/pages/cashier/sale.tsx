import React from 'react'
import Link from 'next/link'
import Layout from '@/components/layouts/sale';

export default function Sale() {
  return (
    <Layout>
      <div>sale</div>
      <Link href="/" className='bg-yellow-500 px-4 py-2 rounded-xl'>Back home</Link>
    </Layout>
  );
}
