import { Column, ID, Task } from "@/type"
import { Button } from "./ui/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react";
import TaskContainer from "./TaskContainer";

interface Props {
    column: Column;
    deleteColumn: (id: ID) => void;
    updateColumn: (id: ID, title: string) => void;
    createTask: (columnID: ID) => void;
    tasks: Task[];
    deleteTask: (id: ID) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask } = props;
    const [editMode, setEditMode] = useState(false)

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
            <div ref={setNodeRef} style={myStyle} className="opacity-30 border-2 border-blue-700 backdrop-blur-[16px] shadow-2xl p-1 w-[350px] h-[500px] rounded-md flex flex-col">
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={myStyle} className="backdrop-blur-[16px] shadow-2xl p-1 w-[350px] min:h-[500px] h-fit rounded-md flex flex-col">
            <div {...attributes} {...listeners} onClick={() => { setEditMode(true) }} className="bg-gray-400 dark:bg-gray-900 p-2 rounded-t-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-white dark:bg-gray-950 px-2 py-1 text-sm rounded-full">0</div>
                    {!editMode ? column.title :
                        <input
                            className="bg-gray-400 dark:bg-gray-900 focus:border-blue-700 border rounded outline-none"
                            value={column.title}
                            onChange={e => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false)
                            }}
                        />
                    }

                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteColumn(column.id)}>
                    <FaRegTrashAlt className="text-red-700" />
                </Button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-3">
                {tasks.map((task) => (
                    <TaskContainer task={task} deleteTask={deleteTask} />
                ))}
            </div>
            <Button color="primary" size={"sm"} variant="outline" onClick={() => { createTask(column.id) }}>
                <CiCirclePlus /> Add tasks
            </Button>
        </div>
    )
}

export default ColumnContainer
