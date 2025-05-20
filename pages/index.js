import Head from 'next/head'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  return (
    <>
      <Head>
        <title>Titanium Cutting Board</title>
        <meta name="description" content="Premium titanium cutting board" />
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <ProductCard />
      </main>
    </>
  )
}
