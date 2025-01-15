import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import AvatarProf from "./AvatarProf";
import { useNavigate } from "react-router-dom";


export function DropdownProfile() {
    const currentOff = useAuthStore((state) => state.currentOff)
    const userImg = useAuthStore((state) => state.currentAuthImg)
    const userEmail = useAuthStore((state) => state.currentAuthEmail)
    const userName = useAuthStore((state) => state.currentAuthDisplayName)
    const navigate = useNavigate();
    const HandleSignOut = async () => {
        try {
            await signOut(auth).then(() => {
                navigate("/");
            }).then(() => {
                toast.success("Signed out successfully");
            });
            currentOff()
        } catch (error) {
            console.error("Sign-out failed:", error);
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                    {userImg && <AvatarProf src={userImg} />}
                    <Button variant="outline">

                        {userName}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={HandleSignOut}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}