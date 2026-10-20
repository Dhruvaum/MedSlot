export const parseUtcDate = (iso: string): Date => {
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(iso)
  return new Date(hasTimezone ? iso : `${iso}Z`)
}
