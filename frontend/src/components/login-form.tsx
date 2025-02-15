import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { backEndBaseURL } from "@/utils/baseUrl";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const currentOn = useAuthStore((state) => state.currentOn)
  const navigate = useNavigate();
  const handleSignInWithGoogle = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, googleProvider)
      const userId = userCredential.user.uid;
      const userImg = userCredential.user.photoURL;
      const userEmail = userCredential.user.email;
      const userName = userCredential.user.displayName;
      const res = await fetch(`${backEndBaseURL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userId,
          email: userEmail,
          displayName: userName,
          photoURL: userImg,
          authProvider: "google",
          additionalInfo: {
            phoneNumber: null,
            role: "user",
            isActive: true,
          },
        })
      });
      if (res.ok) {
        navigate("/mytask")
        toast.success("Login successfully");
        currentOn(userId, userImg, userEmail, userName)
      } else {
        toast.error("Login failed");
        console.log(res.status)
      }

    } catch (error) {
      console.log("error", error);
    }
  }


  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-slate-500 dark:text-slate-400">
          Enter your email below to login to your account
        </p>
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
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200 dark:after:border-slate-800">
          <span className="relative z-10 bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={() => { handleSignInWithGoogle() }}>
          <FcGoogle />Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{""}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
