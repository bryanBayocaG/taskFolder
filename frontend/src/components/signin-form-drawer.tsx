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
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, User, signInWithEmailAndPassword } from "firebase/auth";
import { backEndBaseURL } from "@/utils/baseUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useState } from "react";

interface Props {
    variant: "bordered" | "ghost" | "shadow" | "light";
    size?: "sm" | "md" | "lg";
    className?: string
}

export default function SignInFormDrawer({ variant, size, className }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentOn = useAuthStore((state) => state.currentOn)
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignInWithGoogle = async () => {
        try {
            googleProvider.setCustomParameters({ prompt: "select_account" });
            const userCredential = await signInWithPopup(auth, googleProvider)
            const user = userCredential.user;
            if (!user) throw new Error("Google sign-in failed");
            const userData = {
                uid: user.uid,
                email: user.email,
                password: null,
                displayName: user.displayName,
                photoURL: user.photoURL,
                authProvider: "google",
                additionalInfo: {
                    phoneNumber: null,
                    role: "user",
                    isActive: true,
                },
            };
            const res = await fetch(`${backEndBaseURL}/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            await handleApiResponse(res, user);
        } catch (error) {
            console.error("Google Sign-in error:", error);
            toast.error("An error occurred during Google sign-in");
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            console.log("user", user)
            const res = await fetch(`${backEndBaseURL}/api/user/login/${user.uid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                }),
            });
            await handleApiResponse(res, user);
            setEmail("")
            setPassword("")
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case "Firebase: Error (auth/invalid-credential).":
                        toast.warning("Invalid credentials");
                        break;

                }
                console.log(error.message)
            }
        }
    }
    const handleApiResponse = async (res: Response, user: User) => {
        const data = await res.json();
        if (res.ok) {
            if (data.message === "user not found") {
                toast.info("Email is not registered. Please proceed to Sign up");
                return;
            }
            if (data.message === "email not match, invalid input") {
                toast.info("Email not match. Please proceed to Sign up");
                return;
            }
            navigate("/mytask");
            toast.success("Login successfully");
            currentOn(user.uid, user.photoURL, user.email, user.displayName);
        } else {
            console.error(`Login failed with status: ${res.status}`);
            toast.error("Login failed");
        }
    };

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
                                    <form className="flex flex-col gap-6 " onSubmit={handleSubmit}>
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <h1 className="text-2xl font-bold">Log in to your account</h1>
                                        </div>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" placeholder="m@example.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    required />
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
                                                <Input id="password" type="password"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    required />
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
                                        <Button className="w-full" onPress={() => { handleSignInWithGoogle() }}>
                                            <FcGoogle />Sign in with Google
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