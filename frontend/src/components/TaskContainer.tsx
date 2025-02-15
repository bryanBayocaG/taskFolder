import { ID, Task } from "@/type"
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
    task: Task;
    deleteTask: (id: ID) => void;
}
function TaskContainer({ task, deleteTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    return (
        <div key={task.id}
            onMouseEnter={() => { setMouseIsOver(true) }}
            onMouseLeave={() => { setMouseIsOver(false) }}
            className="flex bg-slate-400 dark:bg-zinc-600 p-2 rounded-md items-center text-left hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab"
        >
            <div className="flex-[12]">
                {task.content}
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
