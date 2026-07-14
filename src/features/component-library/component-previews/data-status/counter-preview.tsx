import { useState } from 'react'
import { Counter } from '@/components/counter'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { glassIconButtonClassName } from '../shared/preview-tokens'

export function CounterPreview() {
  const [value, setValue] = useState(17.8)

  return (
    <PreviewDemoSurface
      label="data structure"
      title="Rolling Number Counter"
      subtitle="increment decimal values"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.24),transparent_55%)]"
    >
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <Counter
          value={value}
          fontSize={78}
          textColor="#ffffff"
          fontWeight={700}
          gradientHeight={0}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium ${glassIconButtonClassName}`}
            aria-label="Decrease counter value"
            onClick={() => setValue((current) => Number((current - 1).toFixed(1)))}
          >
            -
          </button>
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium ${glassIconButtonClassName}`}
            aria-label="Increase counter value"
            onClick={() => setValue((current) => Number((current + 1).toFixed(1)))}
          >
            +
          </button>
        </div>
      </div>
    </PreviewDemoSurface>
  )
}
