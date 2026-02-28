export const RegisterSuccess = ({ email }: { email: string }) => {
  return (
    <section className="border-accent container mx-auto mt-16 flex flex-col border p-6 uppercase md:my-40 md:w-150 md:p-10">
      <h2 className="text-accent mb-6 text-lg md:text-xl">
        <span aria-hidden="true">
          &gt; UPLINK_INITIATED<span className="animate-blink">_</span>
        </span>
        <span className="sr-only">Uplink initiated</span>
      </h2>

      <div className="text-sm md:text-base">
        <p className="mb-4">A verification protocol has been dispatched to:</p>
        <p className="text-accent font-bold underline">{email}</p>

        <div className="border-border my-6 border-y py-6">
          <p className="text-center">
            Check your terminal (inbox) and authorize the access. If not found,
            scan the <span className="text-error-text">SPAM</span> sector.
          </p>
        </div>

        <p className="text-text-disabled text-left">
          <span aria-hidden="true">STATUS: PENDING_AUTHORIZATION</span>
          <span className="sr-only">Status: pending authorization</span>
          <br />
          <span aria-hidden="true">WAITING_FOR_HANDSHAKE...</span>
          <span className="sr-only">Waiting for handshake...</span>
        </p>
      </div>
    </section>
  )
}
