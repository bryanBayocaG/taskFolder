import ColumnContainer from "@/components/ColumnContainer";
import { Button } from "@/components/ui/button";
import { Column, ID, Task } from "@/type";
import { useMemo, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, DragOverEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";
import TaskContainer from "@/components/TaskContainer";
import { useAuthStore } from "@/store";

function MineTask() {
    const currentAuth = useAuthStore((state) => state.currentAuth)
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);
    const [tasks, setTasks] = useState<Task[]>([])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            }
        })
    )
    return (

        <>
            {currentAuth ?

                <DndContext
                    onDragStart={onDragStartFNC}
                    onDragEnd={onDragEndFNC}
                    sensors={sensors}
                    onDragOver={onDrageOverFNC}
                >
                    <div className="m-auto flex h-full w-full items-center overflow-x-auto overflow-y-hidden px-2">
                        <div className="flex gap-5 mr-5">
                            <SortableContext items={columnsID}>
                                {columns.map((column) => (
                                    <ColumnContainer
                                        key={column.id}
                                        column={column}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        createTask={createTask}
                                        tasks={tasks.filter((task) => task.columnID === column.id)}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                        <Button onClick={CreateColumn} variant="outline" className="w-40">
                            <CiCirclePlus />
                            Add another list
                        </Button>
                    </div>
                    {createPortal(<DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                tasks={tasks.filter((task) => task.columnID === activeColumn.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        )}
                        {activeTask &&
                            <TaskContainer task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
                        }
                    </DragOverlay>,
                        document.body
                    )}
                </DndContext>
                :
                <div className="m-auto flex h-full w-full items-center overflow-x-auto overflow-y-hidden px-2">
                    not auth
                </div>
            }

        </>
    )

    function CreateColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd])
    }
    function generateId() {
        return Math.floor(Math.random() * 1000)
    }
    function deleteColumn(id: ID) {
        const filteredColumns = columns.filter((col) => col.id != id);
        setColumns(filteredColumns)
        const newTask = tasks.filter(t => t.columnID != id);
        setTasks(newTask)
    }

    function createTask(columnID: ID) {
        const newTask: Task = {
            id: generateId(),
            columnID,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask])
    }
    function deleteTask(id: ID) {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks)
    }
    function updateTask(id: ID, content: string) {
        const newTask = tasks.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content }
        });
        setTasks(newTask)

    }
    function updateColumn(id: ID, title: string) {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col;
            return { ...col, title }
        });
        setColumns(newColumns)

    }


    function onDragStartFNC(e: DragStartEvent) {
        console.log("Dragging is happening", e)
        if (e.active.data.current?.type === "Column") {
            setActiveColumn(e.active.data.current.column);
            return
        }
        if (e.active.data.current?.type === "Task") {
            setActiveTask(e.active.data.current.task);
            return
        }
    }
    function onDragEndFNC(e: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)
        const { active, over } = e;
        if (!over) return;

        const activeColumnID = active.id;
        const overColumnID = over.id;

        if (activeColumnID === overColumnID) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnID)
            const overColumnIndex = columns.findIndex((col) => col.id === overColumnID)
            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }
    function onDrageOverFNC(e: DragOverEvent) {
        const { active, over } = e;
        if (!over) return;

        const activeTaskID = active.id;
        const overTaskID = over.id;

        if (activeTaskID === overTaskID) return;
        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        //dropping task over other task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex(t => t.id === activeTaskID)
                const overIndex = tasks.findIndex(t => t.id === overTaskID)
                tasks[activeIndex].columnID = tasks[overIndex].columnID;
                return arrayMove(tasks, activeIndex, overIndex)
            })
        }

        const isOverColumn = over.data.current?.type === "Column"
        //dropping task over other column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex(t => t.id === activeTaskID)
                tasks[activeIndex].columnID = overTaskID;
                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }

    }

}



export default MineTask
