function CompletedTodos({props, toggleCompleted}){
    const completedTodos = []
    props.forEach((todo)  =>{
        if(todo.completed){completedTodos.push(todo)}
    })
    return(
        <div>
            {completedTodos.map((todo)=> (
            <div key = {todo.id}>
                <h1>{todo.title}</h1>
                <p>{todo.description}</p>
                <p>Due Date: {todo.due}</p>
                <p>Completed: Yes</p>
                <button onClick={() => (toggleCompleted(todo))}>Mark Incomplete</button>
            </div>
        ))}
        </div>
    )
}

export default CompletedTodos