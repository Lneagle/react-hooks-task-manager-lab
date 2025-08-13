import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:6001/tasks')
        .then(r=>r.json())
        .then(data=>setTasks(data))
        
    }, []);

    function toggleComplete(task) {
        fetch(`http://localhost:6001/tasks/${task.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                completed: !task.completed,
            }),
        })
        .then(r => {
            if (r.ok) {
                return r.json();
            } else {
                console.log("failed to update item")
            }
        })
        .then(updatedTask => {
            const updatedTasks = tasks.map(task => {
                if (task.id ===updatedTask.id) {
                    return updatedTask;
                } else {
                    return task;
                }
            });
            setTasks(updatedTasks);
        })
        .catch(error => console.log(error));
    }

    function addTask(task) {
        fetch("http://localhost:6001/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        })
        .then(r => {
            if (r.ok) {
                return r.json()
            } else {
                console.log("item failed to create")
            }
        })
        .then(newTask => setTasks([...tasks, newTask]))
        .catch(error => console.log(error))
    }

    return (
        <TaskContext value={{tasks, setTasks, toggleComplete, addTask}}>
            {children}
        </TaskContext>
    );
}
