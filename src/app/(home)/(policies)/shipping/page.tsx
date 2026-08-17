import {
  PageEyebrow,
  PageHeader,
  SectionBlock,
  SectionHeader,
} from '@/app/(home)/(policies)/_components'

export default function ShippingAndDeliveryPage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <PageHeader>
          <span className="sr-only">Shipping and delivery</span>
          <span aria-hidden="true">[ Shipping & Delivery ]</span>
        </PageHeader>
        <PageEyebrow>
          Review our shipping policies, delivery times, and costs to ensure a
          smooth uplink and package retrieval.
        </PageEyebrow>
      </div>

      <div className="flex flex-col gap-8">
        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">01 Processing time</span>
            <span aria-hidden="true">{'//'} 01 PROCESSING_TIME</span>
          </SectionHeader>
          <p className="text-sm leading-relaxed">
            All orders are processed within 1 to 2 business days (excluding
            weekends and holidays) after receiving your order confirmation
            email. You will receive another notification when your order has
            shipped and the tracking beacon is active
          </p>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">02 Rates and estimates</span>
            <span aria-hidden="true">{'//'} 02 RATES_AND_ESTIMATES</span>
          </SectionHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3">Shipping Method</th>
                  <th className="pb-3">Estimated Delivery</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">Standard Transit</td>
                  <td className="py-4">3-5 business days</td>
                  <td className="py-4 text-right">$ 5.99</td>
                </tr>
                <tr>
                  <td className="py-4">Priority Express</td>
                  <td className="py-4">1-2 business days</td>
                  <td className="py-4 text-right">$ 14.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">03 International shipping</span>
            <span aria-hidden="true">{'//'} 03 INTERNATIONAL_SHIPPING</span>
          </SectionHeader>
          <p className="text-sm leading-relaxed">
            We currently offer international shipping to select sectors
            globally. Shipping charges for your specific coordinates will be
            calculated and displayed securely at checkout. Duties and taxes may
            apply upon arrival.
          </p>
        </SectionBlock>
      </div>
    </>
  )
}
