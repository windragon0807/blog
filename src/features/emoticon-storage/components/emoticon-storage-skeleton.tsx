import { cn } from '@/lib/utils'
import {
  EMOTICON_CONTENT_CLASS_NAME,
  EMOTICON_PAGE_SHELL_CLASS_NAME,
} from '../emoticon-layout-contract'

function EmoticonStorageSkeleton() {
  const tabWidths = ['w-32', 'w-36', 'w-28']
  const categoryWidths = ['w-24', 'w-32', 'w-32', 'w-24', 'w-24', 'w-24']

  return (
    <section
      data-emoticon-skeleton=""
      data-emoticon-viewport-contract="dynamic-safe-area"
      className={EMOTICON_PAGE_SHELL_CLASS_NAME}
    >
      <div className={cn('shrink-0', EMOTICON_CONTENT_CLASS_NAME)}>
        <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-1.5 sm:mb-4 sm:gap-x-6 sm:gap-y-2 md:mb-6 md:gap-x-7">
          {tabWidths.map((width, index) => (
            <div
              key={width}
              className="flex animate-pulse items-center gap-1.5 md:gap-2"
            >
              <div className="h-5 w-5 rounded-md bg-zinc-100 dark:bg-zinc-900 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              <div
                className={cn(
                  'h-7 rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:h-8 md:h-9',
                  width,
                  index === 1 ? 'opacity-60' : ''
                )}
              />
            </div>
          ))}
        </div>

        <div className="-mx-1 mb-3 px-1 py-1 sm:-mx-2 sm:mb-4 sm:px-2 sm:py-2">
          <div className="flex w-max max-w-full gap-1.5 overflow-hidden sm:gap-2">
            {categoryWidths.map((width, index) => (
              <div
                key={`${width}-${index}`}
                className={cn(
                  'h-10 shrink-0 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 sm:h-12',
                  width,
                  index > 2 ? 'hidden sm:block' : ''
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div data-emoticon-grid-shell="" className="min-h-0 flex-1 overflow-hidden">
        <div data-emoticon-grid-scroll="" className="h-full w-full overflow-hidden">
          <div
            data-emoticon-grid-content=""
            className={cn('relative', EMOTICON_CONTENT_CLASS_NAME)}
          >
            <div
              data-emoticon-skeleton-section-heading=""
              className="flex h-[42px] items-end pb-2 sm:h-[74px] sm:pb-4"
            >
              <div className="h-5 w-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:h-8 sm:w-32" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(54px,1fr))] content-start gap-2 px-2">
              {Array.from({ length: 144 }, (_, index) => (
                <div
                  key={index}
                  className="grid h-14 animate-pulse place-items-center rounded-xl"
                >
                  <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { EmoticonStorageSkeleton }
