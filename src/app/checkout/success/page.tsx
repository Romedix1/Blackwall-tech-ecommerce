import { redirect } from 'next/navigation'

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect('/')
  }

  return <></>
}
