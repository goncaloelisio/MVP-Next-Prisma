import { GetServerSideProps } from "next"
import { Task } from "@prisma/client"
import { prisma } from "../../lib/prisma"
import { FormEvent, useState } from "react"

type TaskProps = {
  tasks: Task[]
}

export default function App({ tasks }: TaskProps) {
  const [newTask, setNewTask] = useState('')

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault()

    await fetch('http://localhost:3000/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify({title: newTask}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return (
    <div>
      <ul>
        {tasks.map(task => <li key={task.id}>{task.title}</li>)}
      </ul>
      <form onSubmit={handleCreateTask}>
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} />
        <button type="submit">Regist</button>
      </form> 
    </div>  
  )  
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasks = await prisma.task.findMany()

  const data = tasks.map(task => {
    return {
      id: task.id,
      title: task.title,
      isDone: task.isDone,
      date: task.createdAt.toISOString()
    }
  })

  return {
    props: {
      tasks: data
    }
  }
}