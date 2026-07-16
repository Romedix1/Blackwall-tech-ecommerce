'use client'

import { cn } from '@/lib'
import { useState } from 'react'

type LogType = {
  action: string
  createdAt: Date
  details: string
  user: { username: string } | null
}

type ViewLogsProps = {
  log: LogType
}

export const ViewLogs = ({ log }: ViewLogsProps) => {
  const [openedDetails, setOpenedDetails] = useState(false)

  const detailsParagraphStyles = 'text-text-second text-sm'

  return (
    <li className="group list-none border">
      <button
        onClick={() => setOpenedDetails(!openedDetails)}
        aria-expanded={openedDetails}
        className="hover:bg-accent/20 focus:bg-accent/20 w-full cursor-pointer items-center justify-between p-4 text-left outline-none"
      >
        <div className="flex items-center justify-between">
          <div className="flex w-10/12">
            <span className="text-accent truncate text-sm font-bold uppercase">
              <span aria-hidden="true" className="uppercase">
                {log.action.replace(/\s+/g, '_')}
              </span>
              <span className="sr-only">{log.action}</span>
            </span>
            <span className="mx-2 text-xs">-</span>
            <span className="text-text-second truncate text-sm">
              {log.user?.username ? log.user.username : 'guest'}
            </span>
          </div>

          <div className="text-text-second group-hover:text-accent ml-2 shrink-0 cursor-pointer text-sm font-bold whitespace-nowrap transition-colors outline-none">
            <span
              aria-hidden="true"
              className={cn(openedDetails && 'rotate-180', 'block')}
            >
              [v]
            </span>
            <span className="sr-only">
              {openedDetails ? 'open' : 'close'} details
            </span>
          </div>
        </div>

        {openedDetails && (
          <div className="mt-6 flex flex-col gap-6">
            <p className={cn(detailsParagraphStyles)}>
              <span aria-hidden="true" className="uppercase">
                [ Log_created_at ]:{' '}
              </span>
              <span className="sr-only">Log created at:</span>
              {log.createdAt.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>

            <p className={cn(detailsParagraphStyles)}>
              <span aria-hidden="true" className="uppercase">
                [ Log_created_by ]:{' '}
              </span>
              <span className="sr-only">Log created by:</span>
              {log.user?.username || 'Guest'}
            </p>

            <p className={cn(detailsParagraphStyles)}>
              <span aria-hidden="true" className="uppercase">
                [ Log_action ]:{' '}
              </span>
              <span className="sr-only">Log action:</span>
              {log.action}
            </p>

            <p className={cn(detailsParagraphStyles)}>
              <span aria-hidden="true" className="uppercase">
                [ Log_details ]:{' '}
              </span>
              <span className="sr-only">Log details:</span> {log.details}
            </p>
          </div>
        )}
      </button>
    </li>
  )
}
