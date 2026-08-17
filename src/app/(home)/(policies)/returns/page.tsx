import {
  PageEyebrow,
  PageHeader,
  SectionBlock,
  SectionHeader,
} from '@/app/(home)/(policies)/_components'

export default function ReturnsPolicyPage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <PageHeader>
          <span className="sr-only">Returns policy</span>
          <span aria-hidden="true">[ Returns Policy ]</span>
        </PageHeader>
        <PageEyebrow>
          Review our guidelines for hardware returns, system exchanges, and
          refund processing
        </PageEyebrow>
      </div>

      <div className="flex flex-col gap-8">
        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">01 Return window</span>
            <span aria-hidden="true">{'//'} 01 RETURN_WINDOW</span>
          </SectionHeader>
          <p className="text-sm leading-relaxed">
            We accept returns within 30 days of the original delivery date. The
            hardware must be in its original packaging, unused, and completely
            free of any physical damage or unauthorized modifications
          </p>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">02 Non returnable items</span>
            <span aria-hidden="true">{'//'} 02 NON_RETURNABLE_ITEMS</span>
          </SectionHeader>
          <ul className="list-inside list-disc text-sm leading-relaxed">
            <li>Opened software and digital access keys</li>
            <li>Custom-built rigs and personalized hardware configurations</li>
            <li>
              Items marked as {'"Final Sale"'} or {'"Clearance"'}
            </li>
          </ul>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">03 refund processing</span>
            <span aria-hidden="true">{'//'} 03. REFUND_PROCESSING</span>
          </SectionHeader>
          <p className="text-sm leading-relaxed">
            Once your return is received and inspected by our technicians, we
            will notify you of the approval or rejection of your refund.
            Approved refunds will be processed, and a credit will automatically
            be applied to your original method of payment within 5-7 business
            days
          </p>
        </SectionBlock>
      </div>
    </>
  )
}
