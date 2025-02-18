import { createBrowserRouter, redirect } from 'react-router-dom'
import { Layout } from './ui/layout'

import {
  AddTrackModal,
  AddTrackWithParamsModal,
  UpdateTrackModal
} from '@/features/manage-track'
import { tracksApi, TracksApiProvider } from '@/services/track'
import { routes } from '@/kernel/routes'
import { TracksTablePage } from '@/pages/tracks'
import { TaskListPage } from '@/pages/tasks'
import { AuthProvider, LoginForm, RegisterForm } from '@/services/auth'
import { FormLayout } from './ui/form-layout'

export const router = createBrowserRouter([
  {
    // path: '/',
    element: (
      <TracksApiProvider value={tracksApi}>
        <AuthProvider>
          <Layout />
          <AddTrackModal />
          <AddTrackWithParamsModal />
          <UpdateTrackModal />
        </AuthProvider>
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
        element: <FormLayout />,
        children: [
          { path: 'register', element: <RegisterForm /> },
          { path: 'login', element: <LoginForm /> }
        ]
      },
      {
        path: routes.tasks,
        element: <TaskListPage />
      }
    ]
  }
  // {
  //   element: <FormLayout />,
  //   children: [
  //     { path: 'register', element: <RegisterForm /> },
  //     { path: 'login', element: <LoginForm /> }
  //   ]
  // }
])
