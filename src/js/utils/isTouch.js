export function isTouch() {
  if ('standalone' in navigator) {
    return true // iOS devices
  }
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    return true // Safari browser
  }
  const hasCoarse = window.matchMedia('(pointer: coarse)').matches
  if (hasCoarse) {
    return true
  }
  const hasPointer = window.matchMedia('(pointer: fine)').matches
  if (hasPointer) {
    return false // prioritize mouse control
  }

  // Otherwise, fall-back to older style mechanisms.
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
