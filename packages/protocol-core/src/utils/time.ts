export const ONE_DAY = 86400

export function getDayTimestamps(startTime: number, endTime: number): number[] {
  const firstDay = Math.floor(startTime / ONE_DAY) * ONE_DAY
  const lastDay = Math.floor(endTime / ONE_DAY) * ONE_DAY
  const timestamps: number[] = []
  for (let t = firstDay; t <= lastDay; t += ONE_DAY) {
    timestamps.push(t)
  }
  return timestamps
}

export function getDayIds(startTime: number, endTime: number): number[] {
  const firstId = Math.floor(startTime / ONE_DAY)
  const lastId = Math.floor(endTime / ONE_DAY)
  const ids: number[] = []
  for (let id = firstId; id <= lastId; id++) {
    ids.push(id)
  }
  return ids
}

export function getLast7DayTimestamps(): number[] {
  const now = Math.floor(Date.now() / 1000)
  const today = Math.floor(now / ONE_DAY) * ONE_DAY
  return Array.from({ length: 7 }, (_, i) => today - i * ONE_DAY)
}
