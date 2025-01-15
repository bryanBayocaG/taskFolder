import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { DropdownProfile } from "./DropdownProfile"
import { useAuthStore } from "@/store"
import AvatarProf from "./AvatarProf"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const currentAuth = useAuthStore((state) => state.currentAuth)
  const userImg = useAuthStore((state) => state.currentAuthImg)
  const userEmail = useAuthStore((state) => state.currentAuthEmail)
  const userName = useAuthStore((state) => state.currentAuthDisplayName)
  const currentOff = useAuthStore((state) => state.currentOff)
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
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950 p-3">
      <div className="container mx-auto flex h-fit max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center gap-2" >
          <div className="h-10 w-10 md:h-20 md:w-20 ">
            <img src="/KanbanDrk.svg" alt="" className="hidden dark:block" />
            <img src="/Kanban.svg" alt="" className="dark:hidden" />
          </div>
          {/* <MountainIcon className="h-6 w-6" /> */}
          <span className="font-bold">Task Folder</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">

          <a
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

          >
            About
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

          >
            Services
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

          >
            Contact
          </a>

        </nav>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Search</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] p-4">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input type="search" placeholder="Search..." className="pl-8 w-full" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          {currentAuth &&
            <div className="hidden md:block">
              <DropdownProfile />
            </div>
          }

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <div className="grid gap-4 p-4">
                <div className="flex items-center gap-2">
                  {userImg && <AvatarProf src={userImg} />}
                  <div>
                    <h2 className="text-lg font-bold">{userName}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

                >
                  About
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

                >
                  Contact
                </a>
                {currentAuth &&
                  <a
                    onClick={HandleSignOut}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"

                  >
                    Logout
                  </a>
                }

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}