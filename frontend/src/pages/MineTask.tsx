import ColumnContainer from "@/components/ColumnContainer";
import { BackEndColumnData, BackEndTaskData, Column, ID, Task } from "@/type";
import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, DragOverEvent } from "@dnd-kit/core"
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";
import TaskContainer from "@/components/TaskContainer";
import { useAuthStore, useColumnStore, useTaskStore } from "@/store";
import FobiddenPage from "@/pages/FobiddenPage";
import { backEndBaseURL } from "@/utils/baseUrl";
import { Spinner } from "@heroui/react";
import ModalPopUp from "@/components/Modal";
import { useParams } from "react-router-dom";

function MineTask() {
    const { id, name } = useParams();
    const currentAuth = useAuthStore((state) => state.currentAuth)
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)

    const columns = useColumnStore((state) => state.columns)
    const setColumns = useColumnStore((state) => state.setColumns);

    const tasks = useTaskStore((state) => state.tasks)
    const setTasks = useTaskStore((state) => state.setTasks);

    const [isLoading, setLoading] = useState(false);
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);

    // const [tasks, setTasks] = useState<Task[]>([])
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
                const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/column/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (!res.ok) {
                    throw new Error('Failed to fetch columns');
                }
                const data = await res.json()
                const transformedColumns = data.data.map((column: BackEndColumnData) => ({
                    id: column._id,
                    title: column.columnName,
                    position: column.position,
                }));
                setColumns(transformedColumns);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
            } finally {
                setLoading(false);
            }
        }

        const fetchTasks = async () => {
            try {
                const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/task`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (!res.ok) {
                    throw new Error('Failed to fetch columns');
                }
                const data = await res.json()
                const transformedTasks = data.data.map((task: BackEndTaskData) => ({
                    id: task._id,
                    columnID: task.columnID,
                    content: task.content,
                }));

                setTasks(transformedTasks);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
            }
        }
        fetchColumns();
        fetchTasks();

    }, [currentAuthUID, setColumns, setTasks, id])
    return (
        <>
            {currentAuth ?
                <>
                    {isLoading ?
                        <div className="flex h-full w-full justify-center px-2">
                            <Spinner size="lg" color="primary" />
                        </div>
                        :
                        <>
                            <div className="h-[90px] md:h-[120px]"></div>
                            <div className="mx-10">
                                <p className="font-bold text-xl md:text-3xl">
                                    {name} - Board
                                </p>
                            </div>
                            <DndContext
                                onDragStart={onDragStartFNC}
                                onDragEnd={onDragEndFNC}
                                sensors={sensors}
                                onDragOver={onDrageOverFNC}
                            >
                                <div className={`${columns.length === 0 ? "h-[75vh] dark:bg-[#020817]" : "h-fit"} m-auto flex w-full items-center overflow-x-auto overflow-y-hidden p-10`}>
                                    <div className="flex gap-5 mr-5">
                                        <SortableContext items={columnsID}>
                                            {columns.map((column) => (
                                                <ColumnContainer
                                                    key={column.id}
                                                    column={column}
                                                    tasks={tasks.filter((task) => task.columnID === column.id)}
                                                    deleteTask={deleteTask}
                                                    updateTask={updateTask}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>
                                    <ModalPopUp name="Add another list" useFor="addColumn" refID={id} />
                                </div>
                                {createPortal(
                                    <DragOverlay>
                                        {activeColumn && (
                                            <ColumnContainer
                                                column={activeColumn}
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
                        </>
                    }
                </>
                :
                <FobiddenPage />
            }
        </>
    )
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

    function onDragStartFNC(e: DragStartEvent) {
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
        useColumnStore.getState().moveColumn(activeColumnID, overColumnID);
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

        const isOverColumn = over.data.current?.type === "Column"
        useTaskStore.getState().moveTask(activeTaskID, overTaskID, isActiveTask, isOverTask, isOverColumn);
    }
}



export default MineTask
