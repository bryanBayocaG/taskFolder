import { ID, Task } from "@/type"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
    task: Task;
    deleteTask: (id: ID) => void;
    updateTask: (id: ID, content: string) => void;
}
function TaskContainer({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode
    })
    const myStyle = {
        transition,
        transform: CSS.Translate.toString(transform)
    }
    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false)
    }
    if (isDragging) {
        return (
            <div
                className="relative bg-slate-400 dark:bg-zinc-600 p-2 rounded-md items-center text-left border-2 border-sky-500 opacity-50 cursor-grab h-[100px] min-h-[100px]"
                ref={setNodeRef}
                style={myStyle}
            />
        )

    }
    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={myStyle}
                {...attributes}
                {...listeners}
                className="flex bg-slate-400 dark:bg-zinc-600 p-2 rounded-md items-center text-left hover:ring-2 hover:ring-inset hover:ring-sky-500 cursor-grab h-[100px] min-h-[100px]"
            >
                <div className="flex-[12]">
                    <textarea
                        value={task.content}
                        autoFocus
                        placeholder="Task content here"
                        onBlur={toggleEditMode}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.shiftKey) {
                                toggleEditMode()
                            };
                        }}
                        onChange={e => updateTask(task.id, e.target.value)}
                        className="h-full w-full resize-none border-none rounded bg-transparent focus:outline-none"
                    >

                    </textarea>
                </div>
            </div>
        )
    }
    return (
        <div
            ref={setNodeRef}
            style={myStyle}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            key={task.id}
            onMouseEnter={() => { setMouseIsOver(true) }}
            onMouseLeave={() => { setMouseIsOver(false) }}
            className="flex bg-slate-400 dark:bg-zinc-600 p-2 rounded-md items-center text-left hover:ring-2 hover:ring-inset hover:ring-sky-500 cursor-grab h-[100px] min-h-[100px]"
        >
            <div className="flex-[12] overflow-hidden p-1">
                <p className="h-[90%] w-full overflow-y-auto">
                    {task.content}
                </p>

            </div>
            {mouseIsOver &&
                <div className="flex-[1]">
                    <button
                        onClick={() => deleteTask(task.id)}
                        className="hover:scale-125"
                    >
                        <FaRegTrashAlt className="text-red-600 " />
                    </button>
                </div>
            }

        </div>
    )
}

export default TaskContainer
