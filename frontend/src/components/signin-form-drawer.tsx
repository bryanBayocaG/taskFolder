import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
    useDisclosure,
} from "@heroui/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";

interface Props {
    variant: "bordered" | "ghost" | "shadow" | "light";
    size?: "sm" | "md" | "lg";
    className?: string
}

export default function SignInFormDrawer({ variant, size, className }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button
                size={size}
                onPress={onOpen}
                className={cn(className)}
                variant={variant}
            >
                Log in
            </Button>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1"></DrawerHeader>
                            <DrawerBody>
                                <div className="h-full w-full my-24">
                                    <form className="flex flex-col gap-6 ">
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <h1 className="text-2xl font-bold">Log in to your account</h1>
                                        </div>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" placeholder="m@example.com" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">Password</Label>
                                                    <a
                                                        href="#"
                                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </a>
                                                </div>
                                                <Input id="password" type="password" required />
                                            </div>
                                            <Button type="submit" className="w-full bg-[#369BEB] hover:bg-[#3666eb]">
                                                Log in
                                            </Button>
                                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200 dark:after:border-slate-800">
                                                <span className="relative z-10 bg-white px-2 text-slate-500 dark:bg-[#18181b] dark:text-slate-400">
                                                    Or continue with
                                                </span>
                                            </div>

                                        </div>

                                    </form>
                                    <div className="mt-2">
                                        <Button className="w-full">
                                            <FcGoogle />Log in with Google
                                        </Button>
                                    </div>
                                </div>
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}