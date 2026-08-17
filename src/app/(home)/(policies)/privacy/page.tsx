import {
  PageEyebrow,
  PageHeader,
  SectionBlock,
  SectionHeader,
  SectionParagraph,
} from '@/app/(home)/(policies)/_components'

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <PageHeader>
          <span className="sr-only">Privacy protocol</span>
          <span aria-hidden="true">[ Privacy Protocol ]</span>
        </PageHeader>
        <PageEyebrow>
          Review our data handling directives, telemetry collection methods, and
          information security standards.
        </PageEyebrow>
      </div>

      <div className="flex flex-col gap-8">
        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">00 Data disclaimer</span>
            <span aria-hidden="true" className="text-error-text">
              {'//'} 00 DATA_DISCLAIMER
            </span>
          </SectionHeader>
          <SectionParagraph>
            Blackwall Tech is a portfolio project. While we do not use your data
            for commercial purposes, please be aware that to demonstrate
            full-stack functionality, the data you provide is actively persisted
            in our database. Please refrain from submitting any sensitive,
            private, or critical real-world information
          </SectionParagraph>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">01 Telemetry and collection</span>
            <span aria-hidden="true">{'//'} 01 TELEMETRY_AND_COLLECTION</span>
          </SectionHeader>
          <SectionParagraph>
            Platform access is managed via secure OAuth integrations and
            standard credential-based registration. When you create an account
            or initialize a session, essential identity markers (such as your
            email address) are securely transmitted and stored in our Neon
            Serverless Postgres database. For direct registrations, your
            credentials are cryptographically hashed; we never store or process
            raw passwords on our servers
          </SectionParagraph>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">02 Local storage and cookies</span>
            <span aria-hidden="true">{'//'} 02 LOCAL_STORAGE_COOKIES</span>
          </SectionHeader>
          <SectionParagraph>
            This terminal utilizes secure sessions, local storage, and cookies
            purely to maintain your authentication status, cart contents, and UI
            preferences. We do not deploy third-party advertising trackers or
            cross-site surveillance scripts
          </SectionParagraph>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            <span className="sr-only">03 Information security</span>
            <span aria-hidden="true">{'//'} 03 INFORMATION_SECURITY</span>
          </SectionHeader>
          <SectionParagraph>
            All transmissions between your client and our servers are protected
            by standard encryption protocols. While we prioritize the integrity
            of our database, users are advised to employ standard operational
            security practices and remember that this is a demonstration
            environment
          </SectionParagraph>
        </SectionBlock>
      </div>
    </>
  )
}
