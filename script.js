const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[dataNewListForm]')
const newListInput = document.querySelector('[dataNewListInput]')
const dataDeleteListButton = document.querySelector('[dataDeleteListButton]')

const listDisplayContainer = document.querySelector('[dataListDisplayContainer]')
const listTitleElement = document.querySelector('[dataListTitle]')
const listCountElement = document.querySelector('[dataListCount]')
const tasksContainer = document.querySelector('[dataTasks]')
const taskTemplate = document.getElementById('taskTemplate')
const newTaskForm = document.querySelector('[dataNewTaskForm]')
const newTaskInput = document.querySelector('[dataNewTaskinput]')
const clearCompleteTasksButton = document.querySelector('[dataClearCompleteTasksButton]')


const LOCAL_STORAGE_LIST_KEY = 'task.lists'  // Gets lists from local storage
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'  // Gets id of list from local storage
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []  // If lists have been saved, get the saved list
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

// Check if the li container has been clicked
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() == 'li') {
        selectedListId = e.target.dataset.listId  // Add selected list id to active list
        saveAndRender()
    }
})

// Make the number of tasks next to the right title correct
tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() == 'input') {
        const selectedList = lists.find(list => list.id == selectedListId)  // Get selected lists
        selectedTask = selectedList.tasks.find(task => task.id == e.target.id)  // Find task that has been clicked
        selectedTask.complete = e.target.checked  // if task is checked then make it complete
        save()
        renderTaskCount(selectedList)
    }
})

// Clear completed tasks button
clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)  // Find the selected list
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)  // Find completed task in the list and keep them
    saveAndRender()
})

// Make the delete list button work
dataDeleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id != selectedListId)  // Make a new list for the lists and put all lists not bieng deleted in the new list
    selectedListId = null  // Delete selected list id 
    saveAndRender()
})

// Listens when add list button is clicked
newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName == '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    const taskName = newTaskInput.value
    if (taskName == null || taskName == '') return
    const task = createTask(taskName)
    newListInput.value = null
    const selectedList = lists.find(list => list.id == selectedListId)  // Get selected list
    selectedList.tasks.push(task)
    saveAndRender()
})

// Creates list for lists
function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: []}
}

// Create a new task
function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false }
}

// Exactly what it sounds like
function saveAndRender() {
    save()
    render()
}

// Save info to local storage
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))  // Save list list
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)  // Save active list
}

// Draw the list
function render() {
    clearElement(listsContainer)
    renderLists()

    const selectedList = lists.find(list => list.id == selectedListId)  // selectedList is the selected list

    if (selectedListId != null) {
        listDisplayContainer.style.display = ''  // Make display on right dissapear if no list is selected
        listTitleElement.innerText = selectedList.name  // Make Display on right show the correct list name
        renderTaskCount(selectedList)  // Display number of tasks
        clearElement(tasksContainer)  // Clear all tasks not saved
        renderTasks(selectedList)

    } else {
        listDisplayContainer.style.display = 'none'
    }
}

// Draw the tasks
function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)  // Copy task template
        const checkbox = taskElement.querySelector('input')  // Get input for taskElement
        const label = taskElement.querySelector('label')  // Get label for taskElement

        // Check all complete tasks
        checkbox.id = task.id
        checkbox.checked = task.complete

        // Give a task a name that we can read
        label.htmlFor = task.id
        label.append(task.name)

        tasksContainer.appendChild(taskElement)
    })
}

// Get the task count of a list
function renderTaskCount(selectedList) {
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length  // Get number of incompleted tasks
    const tasksString = incompleteTasksCount == 1 ? "task" : "tasks"  // Compact if else statement to see it the task(s) equal one or not
    listCountElement.innerText = `${incompleteTasksCount} ${tasksString} remaining`
}

function renderLists() {
    // Make a list for each list inputed in the text box
    lists.forEach(list => {
        const listElement = document.createElement('li')  // Create <li> tag
        listElement.dataset.listId = list.id  // Give id
        listElement.classList.add('taskList')  // Add it to the class taskList
        listElement.innerText = list.name  // Clear the box

        if (list.id == selectedListId) {listElement.classList.add("activeList")}  // Make selected list the active lise

        listsContainer.appendChild(listElement)  // Add item to list

    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()