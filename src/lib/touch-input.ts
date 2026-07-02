const TOUCH_INPUT_MEDIA_QUERY = '(hover: none), (pointer: coarse)'

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
