import ColumnContainer from "@/components/ColumnContainer";
import { BackEndBoardData, BackEndColumnData, BackEndTaskData, Column, ID, Task } from "@/type";
import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, DragOverEvent, TouchSensor, KeyboardSensor } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";
import TaskContainer from "@/components/TaskContainer";
import { useAuthStore, useColumnStore, useTaskStore } from "@/store";
import FobiddenPage from "@/pages/FobiddenPage";
import { backEndBaseURL } from "@/utils/baseUrl";
import { Spinner, Textarea } from "@heroui/react";
import ModalPopUp from "@/components/Modal";
import { useParams } from "react-router-dom";
import { IoSettingsOutline, IoAlbumsOutline, IoCogOutline, IoPeopleOutline, IoTrashOutline } from "react-icons/io5";
import { Tabs, Tab } from "@heroui/tabs";
import { toast } from "react-toastify";


function MineTask() {
    const { id } = useParams();
    const currentAuth = useAuthStore((state) => state.currentAuth)
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)

    const columns = useColumnStore((state) => state.columns)
    const setColumns = useColumnStore((state) => state.setColumns);

    const tasks = useTaskStore((state) => state.tasks)
    const setTasks = useTaskStore((state) => state.setTasks);
    const deleteTasks = useTaskStore((state) => state.deleteTask);

    const [boardData, setBoardData] = useState<BackEndBoardData>()

    const [isLoading, setLoading] = useState(false);
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            }
        }),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )
    const fetchBoardData = async () => {
        try {
            const res = await fetch(`${backEndBaseURL}/api/board/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (!res.ok) {
                throw new Error('Failed to fetch board data');
            }
            const data = await res.json()
            setBoardData(data.data)
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
        }
    }

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
                position: task.position
            }));

            setTasks(transformedTasks);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
        }
    }
    const handleBoardEdit = async () => {
        try {
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/board/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    updates: boardData
                })
            })

            const data = await res.json()
            if (data.success) {
                fetchBoardData();
                toast.success("Changes has been applied.")
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
        }
    }
    useEffect(() => {
        fetchColumns();
        fetchTasks();
        fetchBoardData();
    }, [])

    return (
        <>
            {currentAuth ?
                <>{isLoading ?
                    <div className="flex h-full w-full justify-center px-2">
                        <Spinner size="lg" color="primary" />
                    </div>
                    :
                    <>
                        <div className="h-[90px] md:h-[120px]"></div>
                        <Tabs aria-label="Options" className="mx-10" /* defaultSelectedKey="settings" */>
                            <Tab
                                key="tasks"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <IoAlbumsOutline />
                                        <span>Task</span>
                                    </div>
                                }
                            >
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
                                                    key={activeColumn.id}
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
                            </Tab>
                            <Tab
                                key="settings"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <IoSettingsOutline />
                                        <span>Settings</span>
                                    </div>
                                }
                            >
                                <div className="h-[75vh] w-full justify-center m-auto flex  md:p-10">
                                    <Tabs aria-label="Options" placement="start" >
                                        <Tab key="general"
                                            className=""
                                            title={
                                                <div className="flex items-center space-x-2">
                                                    <IoCogOutline />
                                                    <span>General</span>
                                                </div>
                                            }
                                        >
                                            <div className="p-5  md:w-[700px]">
                                                <h5 className="font-bold text-2xl pb-2">General</h5>
                                                <hr className="bg-slate-400" />
                                                <label htmlFor="boardName">Board name</label>
                                                <div className="flex justify-items-center mt-2">
                                                    <input
                                                        value={boardData?.boardName ? boardData.boardName.charAt(0).toUpperCase() + boardData.boardName.slice(1) : ""}
                                                        onChange={e =>
                                                            setBoardData(prev => ({
                                                                ...prev!,
                                                                boardName: e.target.value
                                                            }))
                                                        }
                                                        className="p-2 rounded-md w-full bg-gray-800 focus:bg-transparent"
                                                        type="text"
                                                        id="boardName"
                                                    />
                                                </div>
                                                <div className="mt-10" />
                                                <hr className="bg-slate-400" />
                                                <label htmlFor="boardDescription">Board decription</label>
                                                <div className="flex gap-2 ">
                                                    <Textarea
                                                        className="first-letter:capitalize"
                                                        value={boardData?.description ? boardData.description.charAt(0).toUpperCase() + boardData.description.slice(1) : ""}
                                                        onChange={e =>
                                                            setBoardData(prev => ({
                                                                ...prev!,
                                                                description: e.target.value
                                                            }))
                                                        }
                                                        placeholder="Enter your description"
                                                        variant="underlined"
                                                    />
                                                </div>
                                                <div className="flex flex-col items-end mt-5">
                                                    <button onClick={() => { handleBoardEdit() }} className="border border-gray-400 py-1 px-6 rounded-lg hover:bg-gray-700 mt-auto">
                                                        Apply changes
                                                    </button>
                                                </div>
                                                <h4 className="font-bold text-2xl mt-14">
                                                    <span className="text-red-600">Danger</span> Zone
                                                </h4>
                                                <div className="border border-red-400 rounded-md  mt-3">
                                                    <div className="grid grid-cols-1 md:flex p-2 rounded-md items-center gap-3">
                                                        <div className=" flex-[3]">
                                                            <p className="font-bold">Delete this board</p>
                                                            <p className="text-xs">Once you delete a board, there is no going back. Please be certain.</p>
                                                        </div>
                                                        <div className="flex justify-center md:justify-end flex-1">
                                                            <ModalPopUp name="Delete board" refID={id} Icon={IoTrashOutline} useFor="deleteBoard" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab key="member"
                                            title={
                                                <div className="flex items-center space-x-2">
                                                    <IoPeopleOutline />
                                                    <span>Member</span>
                                                </div>
                                            }
                                        >
                                            <div className="p-5 md:w-[700px]">
                                                <h4 className="font-medium text-2xl">
                                                    Feature comming soon...
                                                </h4>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Tab>
                        </Tabs>
                    </>
                }
                </>
                :
                <FobiddenPage />
            }
        </>
    )
    function deleteTask(id: ID) {
        deleteTasks(id)
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
