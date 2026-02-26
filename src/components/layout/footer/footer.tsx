import { FOOTER_DATA } from '@/components/layout/footer/footer-config'
import { Separator } from '@/components/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="container mx-auto mt-20 w-full px-4">
      <h4 className="text-accent mb-8 flex items-center gap-2.5 text-xs font-bold uppercase lg:text-base">
        <Separator className="flex-1" />
        <span aria-hidden="true">{'// '}</span>
        <span aria-hidden="true">End_of_page_data</span>
        <span className="sr-only">End of page data</span>
        <span aria-hidden="true">{' //'}</span>
        <Separator className="flex-1" />
      </h4>

      <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:gap-4">
        {FOOTER_DATA.map((item, index) => {
          return (
            <div
              key={`footer-element-${index}`}
              className="flex min-w-0 flex-1 flex-col gap-3 font-bold"
            >
              <h5 className="text-accent text-base uppercase xl:text-lg">
                <span aria-hidden="true">[ </span>
                {item.title.replace(/\s+/g, '_')}
                <span aria-hidden="true"> ]</span>
              </h5>
              <ul className="text-text-second flex flex-col gap-3 text-sm xl:text-base">
                {item.links.map((link, linkIndex) => {
                  const isSupport = link.text.toUpperCase() === 'SUPPORT'

                  if (link.value && !link.href) {
                    return (
                      <li key={linkIndex} className="uppercase">
                        <span> {link.text}: </span>
                        <span
                          className={cn(
                            link.value === 'ONLINE' && 'text-accent',
                          )}
                        >
                          {link.value}
                        </span>
                      </li>
                    )
                  }

                  return (
                    <li key={linkIndex}>
                      <Link
                        href={link.href!}
                        className="group terminal-hover outline-none"
                      >
                        <span
                          className="hidden group-hover:inline-block group-focus:inline-block"
                          aria-hidden="true"
                        >
                          &gt;&nbsp;
                        </span>
                        {isSupport && <span>{link.text}: </span>}
                        <span>{link.value || link.text}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <Separator className="mt-10 mb-4 md:mb-6" />

      <div className="mb-8 flex flex-col gap-2 md:gap-4">
        <p className="text-text-second text-sm">
          root@system:~# SESSION_TERMINATED_
        </p>
        <p className="text-text-disabled text-sm font-bold">
          Copyright {currentYear} <span aria-hidden="true">{'//'}</span> All
          rights reserved
        </p>
      </div>
    </footer>
  )
}
