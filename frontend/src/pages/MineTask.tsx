import ColumnContainer from "@/components/ColumnContainer";
import { Button } from "@/components/ui/button";
import { Column } from "@/type";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

function MineTask() {
    const [columns, setColumns] = useState<Column[]>([])
    return (
        <div className="m-auto flex min-h-[87svh] w-full items-center overflow-x-auto overflow-y-hidden px-2">
            <div className="flex gap-5 mr-5">
                {columns.map((column) => (
                    <ColumnContainer key={column.id} column={column} />
                ))}
            </div>
            <Button onClick={CreateColumn} variant="outline" className="w-40">
                <CiCirclePlus />
                Add another list
            </Button>
        </div>
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
}



export default MineTask
