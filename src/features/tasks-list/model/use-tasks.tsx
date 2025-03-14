import { useEffect, useState } from 'react'
import { Task } from '../domain/task'
import { tasksListApi } from '../lib/api'
import { reorderItemsArray } from '../lib/reorder.ts'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const data = await tasksListApi.fetchTasks()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async (title: string) => {
    try {
      const maxOrder = Math.max(...tasks.map((t) => t.order), -1)
      const newTask = await tasksListApi.addTask(title, maxOrder + 1)
      setTasks([...tasks, newTask])
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await tasksListApi.deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const toggleDone = async (task: Task) => {
    try {
      const updatedTask = { ...task, isDone: !task.isDone }
      const data = await tasksListApi.updateTask(updatedTask)
      setTasks(tasks.map((t) => (t.id === task.id ? data : t)))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const reorderTasks = async (fromIndex: number, toIndex: number) => {
    const newTasks = reorderItemsArray(tasks, fromIndex, toIndex)

    try {
      await tasksListApi.reorderTasks(newTasks)
      setTasks(newTasks)
    } catch (error) {
      console.error('Error reordering tasks:', error)
    }
  }

  return {
    tasks,
    addTask,
    deleteTask,
    toggleDone,
    reorderTasks
  }
}

// import { useEffect, useState } from 'react'
// import { Task } from '../domain/task'

// export function useTasks() {
//   const [tasks, setTasks] = useState<Task[]>([])

//   useEffect(() => {
//     fetchTasks()
//   }, [])

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/tasks')
//       const data = await response.json()
//       setTasks(data)
//     } catch (error) {
//       console.error('Error fetching tasks:', error)
//     }
//   }

//   const addTask = async (title: string) => {
//     try {
//       const response = await fetch('http://localhost:3001/tasks', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           title: title,
//           isDone: false
//         })
//       })
//       const newTask = await response.json()
//       setTasks([...tasks, newTask])
//     } catch (error) {
//       console.error('Error adding task:', error)
//     }
//   }

//   const deleteTask = async (id: string) => {
//     try {
//       await fetch(`http://localhost:3001/tasks/${id}`, {
//         method: 'DELETE'
//       })
//       setTasks(tasks.filter((task) => task.id !== id))
//     } catch (error) {
//       console.error('Error deleting task:', error)
//     }
//   }

//   const toggleDone = async (task: Task) => {
//     try {
//       const updatedTask = {
//         ...task,
//         isDone: !task.isDone
//       }

//       const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedTask)
//       })

//       const data = await response.json()
//       setTasks(tasks.map((t) => (t.id === task.id ? data : t)))
//     } catch (error) {
//       console.error('Error updating task:', error)
//     }
//   }

//   const reorderTasks = async (fromIndex: number, toIndex: number) => {
//     const newTasks = [...tasks]
//     const [movedTask] = newTasks.splice(fromIndex, 1)
//     newTasks.splice(toIndex, 0, movedTask)

//     try {
//       // Обновить все затронутые задачи новым заказом
//       const updates = newTasks.map((task, index) =>
//         fetch(`http://localhost:3001/tasks/${task.id}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ order: index })
//         })
//       )

//       await Promise.all(updates)
//       setTasks(newTasks)
//     } catch (error) {
//       console.error('Error reordering tasks:', error)
//     }
//   }

//   return {
//     tasks,
//     addTask,
//     deleteTask,
//     toggleDone,
//     reorderTasks
//   }
// }
