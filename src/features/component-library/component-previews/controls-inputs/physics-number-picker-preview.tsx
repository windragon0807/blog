import { useState } from 'react'
import {
  PhysicsNumberPicker,
  type PhysicsNumberPickerStyle,
} from '@/components/physics-number-picker'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function PhysicsNumberPickerPreview() {
  const [value, setValue] = useState(24)

  return (
    <PreviewDemoSurface
      label="value control"
      title="Physics Number Picker"
      subtitle="drag or scroll to settle"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.26),transparent_56%)]"
      contentGapClassName="mt-7 sm:mt-8"
    >
      <div
        data-physics-picker-preview-stage=""
        className="relative isolate flex h-[17rem] w-[min(18rem,82vw)] items-center justify-center sm:h-[19rem]"
      >
        <div className="pointer-events-none absolute inset-x-8 top-10 h-28 rounded-full bg-teal-300/16 blur-3xl" />
        <PhysicsNumberPicker
          value={value}
          min={0}
          max={59}
          onValueChange={setValue}
          label="Pace seconds"
          itemHeight={48}
          visibleItems={5}
          className="!w-24 !rounded-[1.75rem] !bg-transparent !shadow-none sm:!w-28"
          style={{
            '--picker-fade-color': 'transparent',
            '--picker-selection-bg': 'rgba(255,255,255,0.11)',
            '--picker-selection-border': 'rgba(255,255,255,0.16)',
            '--picker-selection-highlight': 'rgba(255,255,255,0.26)',
            '--picker-selection-shadow': 'rgba(45,212,191,0.48)',
          } as PhysicsNumberPickerStyle}
          formatValue={(itemValue, isSelected) => (
            <span
              className={
                isSelected
                  ? 'text-[2.5rem] font-black tabular-nums text-white sm:text-[2.875rem]'
                  : 'text-[2.1rem] font-black tabular-nums text-white/35 sm:text-[2.45rem]'
              }
            >
              {String(itemValue).padStart(2, '0')}
            </span>
          )}
        />
      </div>
    </PreviewDemoSurface>
  )
}
