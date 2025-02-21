import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Divider,
    Input,
} from "@heroui/react";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import { useAuthStore, useColumnStore, useTaskStore } from "@/store";
import { backEndBaseURL } from "@/utils/baseUrl";
import { Column, Task } from "@/type";
import { toast } from "react-toastify";

interface Props {
    name: string;
    useFor: "addColumn" | "addTask" | "addBoard";
    refID?: string | number;
}

export default function ModalPopUp({ name, useFor, refID }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const addColumn = useColumnStore((state) => state.addColumn);
    const addTask = useTaskStore((state) => state.addTask);
    const [nameInput, setName] = useState("")

    const addColumnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/column/${refID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    columnName: nameInput.toLocaleLowerCase()
                })
            })
            if (res.status === 409) {
                toast.warning("Column already exist.")
                return;
            }
            if (!res.ok) {
                throw new Error("a problem with adding a column happened")
            }
            const data = await res.json();
            const formattedData: Column = {
                id: data.data._id,   //rename _id to id
                title: data.data.columnName,  //rename columnName to title
                position: data.data.position,
            };

            addColumn(formattedData)
            onOpenChange()
            setName("")
            toast.success("Column added successfully")
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
    const addTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/task/${refID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    columnID: refID,
                    content: nameInput.toLocaleLowerCase()
                })
            })
            if (res.status === 409) {
                toast.warning("Task already exist.")
                return;
            }
            if (res.status === 403) {
                toast.warning("Accessing invalid column.")
                return;
            }
            if (!res.ok) {
                throw new Error("A problem with adding a task happened");
            }

            const data = await res.json();
            const formattedData: Task = {
                id: data.data._id,   //rename _id to id
                columnID: data.data.columnID,  //rename columnName to title
                content: data.data.content,
            };
            addTask(formattedData)
            onOpenChange()
            setName("")
            toast.success("Column added successfully")
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
    return (
        <>
            <Button onClick={onOpen} variant={"outline"}>
                <CiCirclePlus />
                {name}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" backdrop="blur" className="dark:bg-gray-950">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {useFor === "addColumn" ? (
                                    <div>
                                        <p>Add Column</p>
                                        <p className="text-sm font-thin">More columns to contain task</p>
                                        <Divider className="my-2" />
                                    </div>
                                ) : useFor === "addTask" ? (
                                    <div>
                                        <p>Add Task</p>
                                        <p className="text-sm font-thin">More task to accomplish</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Add Board</p>
                                        <p className="text-sm font-thin">More workspace to work with</p>
                                    </div>
                                )
                                }
                            </ModalHeader>
                            <ModalBody>
                                {useFor === "addColumn" ? (
                                    <form className="w-full" onSubmit={addColumnSubmit}>
                                        <Input
                                            isRequired
                                            label="Column name"
                                            labelPlacement="outside"
                                            placeholder="Enter name of column"
                                            variant="underlined"
                                            type="text"
                                            value={nameInput}
                                            onChange={e => setName(e.target.value)}
                                        />
                                        <div className="flex justify-center w-full mt-5">
                                            <Button variant="outline" type="submit" size="lg">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                ) : useFor === "addTask" ? (
                                    <form className="w-full" onSubmit={addTaskSubmit}>
                                        <Input
                                            isRequired
                                            label="Column name"
                                            labelPlacement="outside"
                                            placeholder="Enter name of column"
                                            variant="underlined"
                                            type="text"
                                            value={nameInput}
                                            onChange={e => setName(e.target.value)}
                                        />
                                        <div className="flex justify-center w-full mt-5">
                                            <Button variant="outline" type="submit" size="lg">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <p>addBoard</p>
                                )

                                }
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
