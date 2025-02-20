import { ID } from "@/type";
import { Card, CardHeader, CardFooter, Image } from "@heroui/react";
import { useNavigate } from "react-router-dom";
interface Props {
    name: string;
    desc: string;
    id: string | number;
    img: string;
}
const defaultIMG = "https://media.istockphoto.com/id/1428668891/vector/escape-from-risk-or-danger-run-away-or-flee-from-fail-or-bankruptcy-company-change-job-or.jpg?s=612x612&w=0&k=20&c=uEieB2nCiaqRBsEZqbQ62NFpu5eMGy-Pln-HkZCg4dY="


const BoardCard = ({ name, desc, id, img }: Props) => {
    const navigate = useNavigate();
    const handleClik = (id: ID) => {
        navigate(`/mytask/${id}`)
    }

    return (
        <button onClick={() => { handleClik(id) }}>
            <Card isFooterBlurred isHoverable className="w-full  md:h-[240px] lg:h-[290px] col-span-12 sm:col-span-7">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny text-white/60 uppercase font-bold">Members</p>
                    <h4 className="text-white/90 font-medium text-xl">{name}</h4>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 w-full h-full object-cover pointer-events-none"
                    src={img ? img : defaultIMG}
                />
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                        <div className="flex flex-col">
                            <p className="text-tiny text-balance text-white/60">{desc}</p>
                        </div>
                    </div>

                </CardFooter>
            </Card>
        </button>
    )
}

export default BoardCard
