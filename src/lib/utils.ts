import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const TOUCH_INPUT_MEDIA_QUERY = '(hover: none), (pointer: coarse)'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTouchInputDevice(targetWindow: Window = window) {
  return targetWindow.matchMedia(TOUCH_INPUT_MEDIA_QUERY).matches
}

export function subscribeToTouchInputDeviceChange(
  callback: (isTouchInput: boolean) => void,
  targetWindow: Window = window
) {
  const mediaQueryList = targetWindow.matchMedia(TOUCH_INPUT_MEDIA_QUERY)
  const handleChange = () => callback(mediaQueryList.matches)

  handleChange()
  mediaQueryList.addEventListener('change', handleChange)

  return () => {
    mediaQueryList.removeEventListener('change', handleChange)
  }
}
