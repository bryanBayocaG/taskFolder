function Footer() {
    return (
        <div className='md:flex p-1 md:p-3 h-fit dark:bg-black bg-white'>
            <div className='flex-[1]'>
                <div className='flex justify-center md:items-center'>
                    <div className="h-10 w-10 md:h-20 md:w-20 ">
                        <img src="/KanbanDrk.svg" alt="" className="hidden dark:block" />
                        <img src="/Kanban.svg" alt="" className="dark:hidden" />
                    </div>
                    <p className='font-bold'>
                        Task Folder
                    </p>
                </div>
                <div className='text-gray-600 text-xs hidden md:text-center md:block'>
                    <p>Develop by Bryan Bayoca</p>
                    <p>Alrights reserve 2024-2025</p>
                </div>
            </div>
            <div className='md:flex-[2] md:mt-0 ' />
            <div className='flex-[1] flex flex-col items-center gap-5 mt-2 md:mt-0 '>
                <p className='text-gray-600 text-center hidden md:flex'>Technology used</p>
                <img className='pointer-events-none w-[50%] md:w-full' src="https://skillicons.dev/icons?i=react,typescript,express,tailwind,js,firebase,mongodb" />
            </div>
            <div className='mt-2 md:mt-0 '>
                <div className='text-gray-600 text-xs text-center md:hidden'>
                    <p>Develop by Bryan Bayoca</p>
                    <p>Alrights reserve 2024-2025</p>
                </div>
            </div>

        </div>
    )
}

export default Footer
