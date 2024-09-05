import { useState } from 'react'
import TodoList from './TodoList'
import CompletedTodos from './CompletedTodos'
import AddTodo from './AddTodo'
import './App.css'

const todoListArray = [
  {
    id: 1,
    title: 'Pay parking garage bill',
    description: 'Pay the parking garage bill by the 1st of the month',
    due: '4/1/2024',
    completed: false
  },
  {
    id: 2,
    title: 'Practice guitar',
    description: 'Do 15 minutes of guitar practice (scales)',
    due: '3/1/2024',
    completed: false
  },
  {
    id: 3,
    title: 'Do laundry',
    description: 'Wash, dry and fold the laundry that is in the bin',
    due: '3/2/2024',
    completed: false
  },
  {
    id: 4,
    title: 'Hockey practice',
    description: 'Go to hockey team practice',
    due: '3/1/2024',
    completed: false
  },
  {
    id: 5,
    title: 'Paint living room',
    description: 'Help dad re-paint the living room',
    due: '3/30/2024',
    completed: false
  },
  {
    id: 6,
    title: 'Finish Web Dev Homework',
    description: 'Do Lab 4 for Web Programming II',
    due: '2/29/2024',
    completed: false
  },
  {
    id: 7,
    title: 'Pay aparment rent',
    description: 'Pay apartment rent by the end of the month',
    due: '3/31/2024',
    completed: false
  },
  {
    id: 8,
    title: 'Walk dogs',
    description: 'Take the dogs for a walk by the end of the day',
    due: '2/27/2024',
    completed: false
  },
  {
    id: 9,
    title: 'Groceries',
    description: 'Buy groceries for the week',
    due: '2/22/2024',
    completed: false
  },
  {
    id: 10,
    title: 'Bowling league',
    description: 'Go to bowling league night on the 3rd',
    due: '3/3/2024',
    completed: false
  }
]

function App() {
  const [todoList, setTodos] = useState(todoListArray)

  const deleteTodo = (id) =>{
    const updatedTodoList = []
    todoList.forEach((todo) => {
      if(todo.id !== id){
        updatedTodoList.push(todo)
      }
    })
    setTodos(updatedTodoList)
  }

  const toggleCompleted = (todo) =>{
    const updatedTodoList = []
    todoList.forEach((listItem)=>{
        if(todo === listItem){
          if(listItem.completed === false){todo.completed = true}
          else{listItem.completed = false}
        }
        updatedTodoList.push(listItem)
    })
    setTodos(updatedTodoList)
  }

  const addTodo = (todo) =>{
    const updatedTodoList = []
    updatedTodoList.push(todo)
    todoList.forEach((listItem) => {
      updatedTodoList.push(listItem)
    })
    setTodos(updatedTodoList)
  }
  
  return (
    <div>
      <AddTodo 
        props = {todoList}
        addTodo = {addTodo}
      />
      <TodoList
        props = {todoList}
        deleteTodo = {deleteTodo}
        toggleCompleted = {toggleCompleted}
      />
      <CompletedTodos
        props = {todoList}
        toggleCompleted = {toggleCompleted}
      />
    </div>
  )
}

export default App
