
const About = () => {
    return (
        <div id="about" className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-center md:text-3xl lg:text-4xl">
                    About Task<span className="text-sky-500">folder</span>
                </h1 >
                <div className=" w-full flex justify-center">
                    <hr className="border-t-2 border-sky-500 w-[20%] md:w-[10%]" />
                </div>
                <div className="relative flex justify-center h-[250px] md:h-[400px] w-full mx-auto">
                    <img
                        src="/meSer.png"
                        alt="Background"
                        className="absolute w-[250px] h-[250px] md:h-[400px] md:w-[400px] object-cover"
                    />
                    <div className="flex flex-col items-center">
                        <div className="h-full">

                        </div>
                        <div className=" w-full lg:px-96 md:px-44 px-10">
                            <p className="relative text-center text-xs text-gray-300 font-medium md:text-base lg:text-lg z-10 ">
                                <span className="text-sky-500">Taskfolder</span> is my <span className="text-sky-500">MERN</span> stackpassion project—a task management web app with a kanban board and drag-and-drop powered by <span className="text-sky-500">DND Kit</span>. Zustand ensures task persistence, while a secure <span className="text-sky-500">RESTful API</span> (Node.js, Express.js, MongoDB) handles the backend. Styled with Tailwind CSS and deployed on Vercel, it’s built for performance, scalability, and a seamless user experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
