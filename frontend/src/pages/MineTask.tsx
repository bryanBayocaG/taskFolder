import ColumnContainer from "@/components/ColumnContainer";
import { BackEndColumnData, Column, ID, Task } from "@/type";
import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, DragOverEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";
import TaskContainer from "@/components/TaskContainer";
import { useAuthStore, useColumnStore } from "@/store";
import FobiddenPage from "@/components/FobiddenPage";
import { backEndBaseURL } from "@/utils/baseUrl";
import { Spinner } from "@heroui/react";
import ModalPopUp from "@/components/Modal";

function MineTask() {
    const currentAuth = useAuthStore((state) => state.currentAuth)
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const columns = useColumnStore((state) => state.columns)
    const setColumns = useColumnStore((state) => state.setColumns);
    const [isLoading, setLoading] = useState(false);

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

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/column`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (!res.ok) {
                    throw new Error('Failed to fetch columns');
                }
                const data = await res.json()

                if (data.success) {
                    // Map and exclude unwanted fields
                    const transformedColumns = data.data.map((column: BackEndColumnData) => ({
                        id: column._id,             // Rename _id to id
                        title: column.columnName,   // Rename columnName to title
                    }));

                    setColumns(transformedColumns);
                } else {
                    throw new Error('No data found');
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message)
                }
            } finally {
                setLoading(false);
            }
        }
        fetchColumns();
    }, [currentAuthUID])

    return (
        <>
            {currentAuth ?
                <>
                    {isLoading ?
                        <div className="flex h-full w-full justify-center px-2">
                            <Spinner size="lg" color="primary" />
                        </div>
                        :

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
                                                updateColumn={updateColumn}
                                                createTask={createTask}
                                                tasks={tasks.filter((task) => task.columnID === column.id)}
                                                deleteTask={deleteTask}
                                                updateTask={updateTask}
                                            />
                                        ))}
                                    </SortableContext>
                                </div>
                                <ModalPopUp name="Add another list" useFor="addColumn" />
                            </div>
                            {createPortal(<DragOverlay>
                                {activeColumn && (
                                    <ColumnContainer
                                        column={activeColumn}
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
                    }
                </>
                :
                <FobiddenPage />
            }

        </>
    )

    function generateId() {
        return Math.floor(Math.random() * 1000)
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
