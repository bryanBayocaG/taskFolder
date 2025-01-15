import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type AvatarProfProps = {
    src: string
}

function AvatarProf({ src }: AvatarProfProps) {
    return (
        <Avatar>
            <AvatarImage src={src} />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}

export default AvatarProf
