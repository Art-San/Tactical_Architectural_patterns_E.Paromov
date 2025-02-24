import { globalEventEmmiter } from '@/kernel/events'
import { UiButton } from '@/shared/ui/button'
import { useTracks } from '@/services/track'
import { computeTable } from '../domain/track'
import { useTracksFilter } from '../model/use-tracks-filter'
import { TableTrack } from './table-track'
import { TracksActions } from './tracks-actions'
import { TracksCell } from './tracks-cell'
import { TracksDayHeadCell } from './tracks-day-head-cell'
import { TracksFilters } from './tracks-filters'
import { TracksSummaryRow } from './tracks-summary-row'
import { TracksTableLayout } from './tracks-table-layout'
import { TracksTaskRow } from './tracks-task-row'

export const TracksTable = () => {
  const { trackDelete, tracks } = useTracks()
  const { filters, setFilters } = useTracksFilter()

  const table = computeTable(tracks, filters, filters.hideWeekends)

  const cellClick = globalEventEmmiter.bindEmit('createTrackWithParams')
  const createClick = globalEventEmmiter.bindEmit('createTrack')
  const trackClick = globalEventEmmiter.bindEmit('trackUpdate')
  return (
    <>
      <TracksFilters
        {...filters}
        {...setFilters}
        actions={
          <UiButton size="md" onClick={() => createClick()}>
            Add Track
          </UiButton>
        }
      />

      <TracksTableLayout
        renderDays={(currentDayRef) =>
          table.header.days.map((day) => (
            <TracksDayHeadCell
              key={day}
              day={day}
              {...filters}
              currentDayRef={currentDayRef}
            />
          ))
        }
        tasks={table.rows.map((row) => (
          <TracksTaskRow
            key={row.task}
            total={row.total}
            task={row.task}
            days={row.days.map((cell) => (
              <TracksCell
                key={cell.day}
                isTracks={cell.tracks.length > 0}
                onClick={() =>
                  cellClick({
                    ...filters,
                    day: cell.day,
                    task: row.task
                  })
                }
                tracks={cell.tracks.map((track) => (
                  <TableTrack
                    key={track.id}
                    track={track}
                    actions={
                      <TracksActions
                        track={track}
                        onUpdateTrack={trackClick}
                        onDeleteTrack={trackDelete}
                      />
                    }
                  />
                ))}
              />
            ))}
          />
        ))}
        summary={
          <TracksSummaryRow
            total={table.summary.total}
            days={table.summary.days}
          />
        }
      />
    </>
  )
}
