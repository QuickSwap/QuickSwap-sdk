import { describe, it, expect } from 'vitest'
import { ONE_DAY, getDayTimestamps, getDayIds, getLast7DayTimestamps } from '../../utils/time'

describe('utils/time', () => {
  it('ONE_DAY is 86400', () => {
    expect(ONE_DAY).toBe(86400)
  })

  describe('getDayTimestamps', () => {
    it('returns timestamps for a 3-day range', () => {
      const start = 1704067200 // 2024-01-01 00:00:00 UTC
      const end = start + 2 * ONE_DAY // 2024-01-03 00:00:00 UTC
      const result = getDayTimestamps(start, end)
      expect(result).toHaveLength(3)
      expect(result[0]).toBe(1704067200)
      expect(result[1]).toBe(1704067200 + ONE_DAY)
      expect(result[2]).toBe(1704067200 + 2 * ONE_DAY)
    })

    it('returns single element when start equals end', () => {
      const ts = 1704067200
      expect(getDayTimestamps(ts, ts)).toHaveLength(1)
    })

    it('snaps to UTC midnight', () => {
      const midday = 1704067200 + 43200 // noon
      const result = getDayTimestamps(midday, midday)
      expect(result[0]).toBe(1704067200) // snapped to midnight
    })

    it('returns empty array when start > end', () => {
      expect(getDayTimestamps(1704067200 + ONE_DAY, 1704067200)).toHaveLength(0)
    })
  })

  describe('getDayIds', () => {
    it('returns floor(timestamp / ONE_DAY) values', () => {
      const start = 1704067200
      const result = getDayIds(start, start + ONE_DAY)
      expect(result).toHaveLength(2)
      expect(result[0]).toBe(Math.floor(start / ONE_DAY))
      expect(result[1]).toBe(Math.floor(start / ONE_DAY) + 1)
    })
  })

  describe('getLast7DayTimestamps', () => {
    it('returns exactly 7 elements', () => {
      expect(getLast7DayTimestamps()).toHaveLength(7)
    })

    it('returns descending order (today first)', () => {
      const result = getLast7DayTimestamps()
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i] - result[i + 1]).toBe(ONE_DAY)
      }
    })

    it('first element is today UTC midnight', () => {
      const result = getLast7DayTimestamps()
      const now = Math.floor(Date.now() / 1000)
      const todayMidnight = Math.floor(now / ONE_DAY) * ONE_DAY
      expect(result[0]).toBe(todayMidnight)
    })
  })
})
