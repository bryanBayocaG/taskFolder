import { Column } from "@/type"

interface Props {
    column: Column;
}

function ColumnContainer(props: Props) {
    const { column } = props;
    return (
        <div className="border bg-white dark:border-gray-800 dark:bg-gray-950 p-3 p-2 w-[350px] h-[500px] rounded-md flex flex-col">
            {column.title}
            <div className="flex flex-grow">

            </div>
            <div>Footer</div>
        </div>
    )
}

export default ColumnContainer
