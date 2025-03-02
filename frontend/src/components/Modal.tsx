import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Divider,
    Input,
    Textarea,
} from "@heroui/react";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import { useAuthStore, useColumnStore, useTaskStore } from "@/store";
import { backEndBaseURL } from "@/utils/baseUrl";
import { Column, Task } from "@/type";
import { toast } from "react-toastify";
import { IconType } from "react-icons";

interface Props {
    name?: string;
    useFor: "addColumn" | "addTask" | "addBoard" | "deleteBoard";
    refID?: string | number;
    fetchAgain?: () => void;
    Icon?: IconType
}

export default function ModalPopUp({ name, useFor, refID, fetchAgain, Icon }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const addColumn = useColumnStore((state) => state.addColumn);
    const addTask = useTaskStore((state) => state.addTask);
    const [nameInput, setName] = useState("");
    const [description, setDescription] = useState("");
    const [confirmationText, setConfirmationText] = useState("");

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
                position: data.data.position,
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

    const addBoardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/board`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    boardName: nameInput.toLocaleLowerCase(),
                    description: description.toLocaleLowerCase()
                })
            })
            if (res.status === 409) {
                toast.warning("Board already exist.")
                return;
            }
            if (!res.ok) {
                throw new Error("A problem with adding a board.");
            }

            onOpenChange()
            setName("")
            fetchAgain?.()
            toast.success("Board added successfully")
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    const deleteBoard = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (confirmationText !== "I want to delete this board") {
                toast.error("Text don't match!")
                return
            }
            toast.success("Board deleted!")
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
    return (
        <>
            <Button onClick={onOpen} variant={"outline"} >
                {Icon ?
                    <Icon /> :
                    <CiCirclePlus />
                }
                {name &&
                    name
                }
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
                                ) : useFor === "deleteBoard" ? (
                                    <div>
                                        <p>Are you sure to delete this board?</p>
                                        <p className="text-sm font-thin">Type "<span className="text-sky-400 font-bold">I want to delete this board</span>" below to proceed.</p>
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
                                ) : useFor === "deleteBoard" ? (
                                    <form className="w-full" onSubmit={deleteBoard}>
                                        <Input
                                            isRequired
                                            label="Type here"
                                            labelPlacement="outside"
                                            variant="flat"
                                            type="text"
                                            value={confirmationText}
                                            onChange={e => setConfirmationText(e.target.value)}
                                        />
                                        <div className="flex justify-center w-full mt-5">
                                            <Button variant="outline" type="submit" size="lg">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <form className="w-full" onSubmit={addBoardSubmit}>
                                        <Input
                                            isRequired
                                            label="Board name"
                                            labelPlacement="outside"
                                            placeholder="Enter name of board"
                                            variant="underlined"
                                            type="text"
                                            value={nameInput}
                                            onChange={e => setName(e.target.value)}
                                        />
                                        <Textarea
                                            className="col-span-12 md:col-span-6 mb-6 mt-5 md:mb-0"
                                            label="Description"
                                            labelPlacement="outside"
                                            placeholder="Enter your description"
                                            variant="underlined"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                        <div className="flex justify-center w-full mt-5">
                                            <Button variant="outline" type="submit" size="lg">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
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
