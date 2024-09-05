function AddTodo({props, addTodo}){ 
    const todoListSize = props.length

    const handleSubmit = async (e) =>{
        e.preventDefault()

        const id = todoListSize + 1
        const title = document.getElementById('title').value.trim()
        const description = document.getElementById('description').value.trim()
        const date = document.getElementById('date').value.trim()
        const min = new Date()

        if(!title || ! description ||!date){throw "Arguments for each field must be provided"}
        if(title.length < 5){throw "Title must be at least length 5"}
        if(description.length < 25) {throw "Description must be at least length 25"}
        const inputDate = new Date(date)
        if(inputDate <= min){throw 'Date must be sometime in the future'}
        const restructureDate = date.split("-")
        const setDate = restructureDate[1] + "/" + restructureDate[2] + "/" + restructureDate[0]

        const newTodo = {
            id: id,
            title: title,
            description: description,
            due: setDate,
            completed: false
        }
        addTodo(newTodo)
        document.getElementById('title').value = ""
        document.getElementById('description').value = ""
        document.getElementById('date').value = ""
    }
    return(
        <div>
            <form id = 'add-todo' onSubmit = {handleSubmit}>
                <label>
                    Title:
                    <input
                        id = 'title'
                        name = 'title'
                        type = 'text'
                        placeholder = 'Title'
                    />
                </label>
                <label>
                    Description:
                    <input
                        id = 'description'
                        name = 'description'
                        type = 'textarea'
                        placeholder = 'Description'
                    />
                </label>
                <label>
                    Date:
                    <input
                        id = 'date'
                        name = 'date'
                        type = 'date'
                        placeholder = 'Date'
                    />
                </label>
                <input type='submit' value = 'Submit'></input>
            </form>
        </div>
    )
}

export default AddTodo