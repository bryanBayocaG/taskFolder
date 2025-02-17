import { Column, ID, Task } from "@/type"
import { Button } from "./ui/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import TaskContainer from "./TaskContainer";
import { useAuthStore, useColumnStore } from "@/store";
import { backEndBaseURL } from "@/utils/baseUrl";

interface Props {
    column: Column;
    createTask: (columnID: ID) => void;
    tasks: Task[];
    deleteTask: (id: ID) => void;
    updateTask: (id: ID, content: string) => void;
}

function ColumnContainer(props: Props) {
    const { column, createTask, tasks, deleteTask, updateTask } = props;
    const [updateTitle, setUpdateTitle] = useState("")
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const deleteCol = useColumnStore((state) => state.deleteColumn);
    const updateColumn = useColumnStore((state) => state.updateColumn);
    const [editMode, setEditMode] = useState(false)

    const taskIDs = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks])

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode
    })
    const myStyle = {
        transition,
        transform: CSS.Translate.toString(transform)
    }
    if (isDragging) {
        return (
            <div ref={setNodeRef} style={myStyle} className="opacity-30 border-2 border-sky-500 backdrop-blur-[16px] shadow-2xl p-1 w-[350px] h-[500px] rounded-md flex flex-col">
            </div>
        )
    }
    const handleDeleteCol = async (id: ID) => {
        try {
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/column/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (!res.ok) {
                throw new Error("column not deleted")
            }
            const data = await res.json();
            console.log("deleted baby", data)
            deleteCol(id);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }

    }
    const handleUpdateCol = async (colID: ID) => {
        try {
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/column/${colID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    columnName: updateTitle.toLowerCase()
                })
            })
            if (!res.ok) {
                throw new Error("update not succesfull")
            }
            const data = await res.json()

            const formattedData = {
                id: data.data._id,   //rename _id to id
                title: data.data.columnName,  //rename columnName to title
            };
            const { id, title } = formattedData;
            updateColumn(id, title);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
        }
        setTimeout(() => {
            setEditMode(false);
        }, 100);
    }

    return (
        <div ref={setNodeRef} style={myStyle} className="backdrop-blur-[16px] shadow-2xl p-1 w-[350px] min:h-[500px]  rounded-md flex flex-col">
            <div {...attributes} {...listeners} onClick={() => { setEditMode(true) }} className="bg-gray-400 dark:bg-gray-900 p-2 rounded-t-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-white dark:bg-gray-950 px-2 py-1 text-sm rounded-full">0</div>
                    {!editMode ? <p className="capitalize">{column.title}</p> :
                        <>
                            <input
                                className="bg-gray-400 dark:bg-gray-900 focus:border-sky-500 border rounded outline-none"
                                value={updateTitle}
                                onChange={e => setUpdateTitle(e.target.value)}
                                onFocus={() => { setUpdateTitle(column.title) }}
                                autoFocus
                                onBlur={(e) => {
                                    if (e.relatedTarget && e.relatedTarget instanceof HTMLElement) {
                                        return;
                                    }
                                    setEditMode(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    handleUpdateCol(column.id);
                                    setEditMode(false); // Close the edit mode when Enter is pressed
                                }}
                            />
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    handleUpdateCol(column.id);
                                }}
                            >
                                <FaCheck className="text-green-600" />
                            </Button>
                        </>
                    }

                </div>
                <Button size="default" variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCol(column.id)
                }}>
                    <FaRegTrashAlt className="text-red-700" />
                </Button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-3 overflow-x-hidden overflow-y-auto h-[400px] min-h-[400px]">
                <SortableContext items={taskIDs}>
                    {tasks.map((task) => (
                        <TaskContainer task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))}
                </SortableContext >
            </div>
            <Button color="primary" size={"sm"} variant="outline" onClick={() => { createTask(column.id) }}>
                <CiCirclePlus /> Add tasks
            </Button>
        </div>
    )
}

export default ColumnContainer
