import { Column, ID } from "@/type"
import { Button } from "./ui/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface Props {
    column: Column;
    deleteColumn: (id: ID) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props;

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    })
    const myStyle = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    if (isDragging) {
        return (
            <div ref={setNodeRef} style={myStyle} className="opacity-30 border-2 border-rose-500 backdrop-blur-[16px] shadow-2xl p-1 w-[350px] h-[500px] rounded-md flex flex-col">

            </div>
        )
    }
    return (
        <div ref={setNodeRef} style={myStyle} className="backdrop-blur-[16px] shadow-2xl p-1 w-[350px] h-[500px] rounded-md flex flex-col">
            <div {...attributes} {...listeners} className="bg-gray-400 dark:bg-gray-900 p-2 rounded-t-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-white dark:bg-gray-950 px-2 py-1 text-sm rounded-full">0</div>
                    {column.title}
                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteColumn(column.id)}>
                    <FaRegTrashAlt className="text-red-700" />
                </Button>
            </div>
            <div className="flex flex-grow">

            </div>
            <div>Footer</div>
        </div>
    )
}

export default ColumnContainer
