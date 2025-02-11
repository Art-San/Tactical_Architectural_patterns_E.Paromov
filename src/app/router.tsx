import { createBrowserRouter, redirect } from 'react-router-dom'
import { Layout } from './components/layout'

import {
  AddTrackModal,
  AddTrackWithParamsModal,
  UpdateTrackModal
} from '@/features/manage-track'
import { tracksApi, TracksApiProvider } from '@/services/track'
import { routes } from '@/kernel/routes'
import { TracksTablePage } from '@/pages/tracks'
import { TaskListPage } from '@/pages/tasks'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <TracksApiProvider value={tracksApi}>
        <Layout />
        <AddTrackModal />
        <AddTrackWithParamsModal />
        <UpdateTrackModal />
      </TracksApiProvider>
    ),
    children: [
      {
        index: true,
        loader: () => redirect(routes.tracks)
      },
      {
        path: routes.tracks,
        element: <TracksTablePage />
      },
      {
        path: routes.tasks,
        element: <TaskListPage />
      }
    ]
  }
])
