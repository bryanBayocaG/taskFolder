import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { backEndBaseURL } from "@/utils/baseUrl";
import SignInFormDrawer from "./signin-form-drawer";

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
      const user = userCredential.user;
      if (!user) throw new Error("Google sign-in failed");
      const userData = {
        uid: user.uid,
        email: user.email,
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
  const handleApiResponse = async (res: Response, user: User) => {
    const data = await res.json();
    if (res.ok) {
      if (data.message === "User already exists") {
        toast.info("User already exists. Please proceed to Log in");
        console.log("User already exists, stopping further execution.");
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
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign up for account</h1>
          <p className="text-balance text-sm text-slate-500 dark:text-slate-400">
            Enter your email below to create to your account
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

            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full bg-[#369BEB] hover:bg-[#3666eb]">
            Sign up
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200 dark:after:border-slate-800">
            <span className="relative z-10 bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              Or continue with
            </span>
          </div>

        </div>

      </form>
      <div className="mt-2">
        <Button variant="outline" className="w-full" onClick={() => { handleSignInWithGoogle() }}>
          <FcGoogle />Sign up with Google
        </Button>
        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <SignInFormDrawer variant={"light"} size={"sm"} className="hover:bg-sky-400" />
        </div>
      </div>
    </>

  )
}
