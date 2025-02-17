import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/react";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import { useAuthStore, useColumnStore } from "@/store";
import { backEndBaseURL } from "@/utils/baseUrl";

interface Props {
    name: string;
    useFor: "addColumn" | "addTask";
}

export default function ModalPopUp({ name, useFor }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const addColumn = useColumnStore((state) => state.addColumn);
    const [colName, setColName] = useState("")

    const handSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/column`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    columnName: colName.toLocaleLowerCase()
                })
            })
            if (!res.ok) {
                throw new Error("a problem with adding a column happened")
            }
            const data = await res.json();
            const formattedData = {
                id: data.data._id,   //rename _id to id
                title: data.data.columnName,  //rename columnName to title
            };

            addColumn(formattedData)
            onOpenChange()
            setColName("")
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                {useFor === "addColumn" ?

                                    <form onSubmit={handSubmit}>
                                        <input type="text"
                                            value={colName}
                                            onChange={e => setColName(e.target.value)}
                                        />
                                        <Button type="submit">
                                            Submit
                                        </Button>
                                    </form>

                                    :
                                    <p>add task</p>
                                }
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
