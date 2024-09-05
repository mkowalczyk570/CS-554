function TodoList({props, deleteTodo, toggleCompleted}){
    const incompleteTodos = []
    props.forEach((todo) => {
        if(!todo.completed){incompleteTodos.push(todo)}
    })


    return (
        <div>
            {incompleteTodos.map((todo) => (
                <div key = {todo.id}>
                    <h1 className={pastDue(todo)}>{todo.title}</h1>
                    <p>{todo.description}</p>
                    <p>Due Date: {todo.due}</p>
                    <p>Completed: No</p>
                    <button onClick = {() => (deleteTodo(todo.id))}>Delete</button>
                    <button onClick = {() => (toggleCompleted(todo))}>Complete</button>
                </div>
            ))}
        </div>
    )      
}

function pastDue(todo){
    const today = new Date()
    const dueDate = new Date(todo.due)
    if(dueDate < today){return "past-due"}
    else{return}
}

export default TodoList