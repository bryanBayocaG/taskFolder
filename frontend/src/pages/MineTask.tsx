import ColumnContainer from "@/components/ColumnContainer";
import { Button } from "@/components/ui/button";
import { Column, ID, Task } from "@/type";
import { useMemo, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";

function MineTask() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);
    const [tasks, setTasks] = useState<Task[]>([])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            }
        })
    )
    return (
        <DndContext onDragStart={onDragStartFNC} onDragEnd={onDragEndFNC} sensors={sensors}>
            <div className="m-auto flex min-h-[600px] w-full items-center overflow-x-auto overflow-y-hidden px-2">
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
                    />
                )}
            </DragOverlay>,
                document.body
            )}
        </DndContext>
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
    }
    function createTask(columnID: ID) {
        const newTask: Task = {
            id: generateId(),
            columnID,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask])
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
    }
    function onDragEndFNC(e: DragEndEvent) {
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

}



export default MineTask
