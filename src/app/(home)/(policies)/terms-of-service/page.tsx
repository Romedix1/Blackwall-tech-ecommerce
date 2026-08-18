import {
  PageEyebrow,
  PageHeader,
  SectionBlock,
  SectionHeader,
  SectionParagraph,
} from '@/app/(home)/(policies)/_components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of service',
}

export default function TermsOfServicePage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <PageHeader>
          <span className="sr-only">Terms of service</span>
          <span aria-hidden="true">[ Terms of Service ]</span>
        </PageHeader>
        <PageEyebrow>
          Review the governing rules and operational directives for accessing
          and using the Blackwall Tech network and hardware services.
        </PageEyebrow>
      </div>

      <div className="flex flex-col gap-8">
        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">00 Project disclaimer</span>
            <span aria-hidden="true" className="text-error-text">
              {'//'} 00 PROJECT_DISCLAIMER
            </span>
          </SectionHeader>
          <p className="text-sm leading-relaxed font-semibold">
            Blackwall Tech is a conceptual portfolio project created for
            demonstration purposes only. No real products are sold, no actual
            hardware is shipped, and any checkout processes or transactions are
            entirely simulated
          </p>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">01 User agreement</span>
            <span aria-hidden="true">{'//'} 01 USER_AGREEMENT</span>
          </SectionHeader>
          <SectionParagraph>
            By accessing our systems, purchasing hardware, or utilizing our
            services, you agree to be bound by these Terms of Service. If you do
            not agree with any part of these terms, you are prohibited from
            using or accessing this site and our proprietary technologies
          </SectionParagraph>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">02 Network access</span>
            <span aria-hidden="true">{'//'} 02 NETWORK_ACCESS</span>
          </SectionHeader>
          <SectionParagraph>
            We grant you a limited, non-exclusive, non-transferable license to
            access and make personal use of our platform. This license does not
            include any resale or commercial use of our services, collection and
            use of any product listings, or any unauthorized data mining and
            extraction tools
          </SectionParagraph>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">03 System liabilities</span>
            <span aria-hidden="true">{'//'} 03 SYSTEM_LIABILITIES</span>
          </SectionHeader>
          <SectionParagraph>
            All hardware and software components are provided {'"as is"'}{' '}
            without any warranties, expressed or implied. In no event shall
            Blackwall Tech or its suppliers be liable for any damages, data
            loss, or system interruptions arising out of the use or inability to
            use our materials
          </SectionParagraph>
        </SectionBlock>
      </div>
    </>
  )
}
