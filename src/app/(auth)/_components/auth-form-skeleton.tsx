export const AuthFormSkeleton = () => {
  return (
    <section className="flex justify-center">
      <div className="mt-16 flex w-full animate-pulse flex-col border p-6 md:my-36 md:w-150 md:p-10">
        <div className="bg-accent mb-2 h-8 w-3/4 md:h-10" />
        <div className="bg-accent h-4 w-1/2" />

        <div className="my-8 flex flex-col gap-4">
          <div className="bg-accent h-11 w-full" />
          <div className="bg-accent h-11 w-full" />
          <div className="bg-accent h-11 w-full" />
        </div>

        <div className="bg-accent h-10 w-full" />

        <div className="mt-6 flex w-full gap-2">
          <div className="bg-accent h-14 flex-1" />
          <div className="bg-accent h-14 flex-1" />
        </div>

        <div className="bg-accent mt-6 h-4 w-2/3 self-center md:mt-8" />
      </div>
    </section>
  )
}
