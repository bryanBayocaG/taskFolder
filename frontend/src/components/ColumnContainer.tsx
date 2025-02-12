import { Column } from "@/type"
import { Button } from "./ui/button";
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
    column: Column;
}

function ColumnContainer(props: Props) {
    const { column } = props;
    return (
        <div className="backdrop-blur-[16px] shadow-2xl p-1 w-[350px] h-[500px] rounded-md flex flex-col">
            <div className="bg-gray-400 dark:bg-gray-900 p-2 rounded-t-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-white dark:bg-gray-950 px-2 py-1 text-sm rounded-full">0</div>
                    {column.title}
                </div>
                <Button size="icon" variant="ghost">
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
