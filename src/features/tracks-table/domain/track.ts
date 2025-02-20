import { Track } from '@/kernel/track'

export type TaskIdentifier = string
export type DayOfMonth = number
export type MonthOfYear = number
export type Year = number

export type DateSelection = {
  selectedMonth: MonthOfYear
  selectedYear: Year
}

export type TableSummaryCell = {
  day: DayOfMonth
  hours: number
}

export type TableSummaryRow = {
  days: number[]
}

export type TableDayCol = {
  day: DayOfMonth
  hours: number
  tracks: Track[]
}

export type TableTaskRow = {
  task: TaskIdentifier
  days: TableDayCol
}

export type TableHeaderRow = {
  days: number[]
}

export type Table = {
  header: TableHeaderRow
  rows: TableTaskRow[]
  summary: TableSummaryRow
}
export function computeTable(
  tracks: Track[],
  dateSelection: DateSelection,
  hideWeekends: boolean
) {
  let days = daysArray(dateSelection)

  if (hideWeekends) {
    days = days.filter((day) => isNotWeekend(dateSelection, day))
    tracks = tracks.filter((track) =>
      isNotWeekend(dateSelection, trackDay(track))
    )
  }

  return {
    header: {
      days
    }
  }
}

const daysArray = (dateSelection: DateSelection) => {
  const days = Array.from(
    { length: daysInMonth(dateSelection) },
    (_, i) => i + 1
  )
  return days
}

const daysInMonth = ({ selectedYear, selectedMonth }: DateSelection) => {
  return new Date(selectedYear, selectedMonth + 1, 0).getDate()
}

const isNotWeekend = (
  { selectedYear, selectedMonth }: DateSelection,
  day: number
) => {
  const date = new Date(selectedYear, selectedMonth, day)
  return !(date.getDay() === 0 || date.getDay() === 6)
}

const filteredTracks = tracks.filter((track) => {
  const trackDate = new Date(track.date)
  return (
    trackDate.getMonth() === selectedMonth &&
    trackDate.getFullYear() === selectedYear &&
    (!hideWeekends || !isNotWeekend(trackDate.getDate()))
  )
})

const summTracks = (summ: number, track: Track) => summ + track.hours

const getTaskTracks = (tracks: Track[], task: TaskIdentifier) =>
  tracks.filter((track) => track.task === task)

const getDayTracks = (tracks: Track[], day: DayOfMonth) =>
  tracks.filter((track) => {
    const trackDate = new Date(track.date)
    return trackDate.getDate() === day
  })

const getDayTotal = (day: number) => {
  return tracks
    .filter((track) => {
      const trackDate = new Date(track.date)
      return trackDate.getDate() === day
    })
    .reduce((sum, track) => sum + track.hours, 0)
}

const getTaskTotal = (task: string) => {
  return tracks
    .filter((track) => {
      return track.task === task
    })
    .reduce((sum, track) => sum + track.hours, 0)
}

const getTotal = () => {
  return tracks.reduce((sum, track) => sum + track.hours, 0)
}

const getUniqueTasks = (tracks: Track[]): TaskIdentifier[] => {
  return [...new Set(tracks.map((track) => track.task))]
}

const trackDay = (track: Track) => new Date(track.date).getDay()
