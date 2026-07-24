import { BuildPcImage } from '@/app/(home)/_components/build-pc'
import { BuildPcDescription } from '@/app/(home)/_components/build-pc'

export const BuildPcSection = () => {
  return (
    <section className="relative container w-full items-center sm:mx-auto sm:px-4 lg:flex lg:flex-row-reverse lg:justify-between lg:border lg:p-12 2xl:p-16">
      <BuildPcImage />
      <BuildPcDescription />
    </section>
  )
}
