import React from 'react'

function Footer() {
    return (
        <div className='flex p-5'>
            <div className='flex-[1] '>
                <div className='flex items-center'>
                    <div className="h-10 w-10 md:h-20 md:w-20 ">
                        <img src="/KanbanDrk.svg" alt="" className="hidden dark:block" />
                        <img src="/Kanban.svg" alt="" className="dark:hidden" />
                    </div>
                    <p>
                        Task Folder
                    </p>
                </div>
                <div className='text-gray-600 text-xs hidden md:block'>
                    <p>Develop by Bryan Bayoca</p>
                    <p>Alrights reserve 2024-2025</p>
                </div>
            </div>
            <div className='flex-[2] '>
                <div className='text-gray-600 text-xs text-center md:hidden'>
                    <p>Develop by Bryan Bayoca</p>
                    <p>Alrights reserve 2024-2025</p>
                </div>
            </div>
            <div className='flex-[1] flex flex-col  gap-5'>
                <p className='text-gray-600 text-center'>Technology used</p>
                <img src="https://skillicons.dev/icons?i=react,typescript,express,tailwind,js,firebase,mongodb" />
            </div>
        </div>
    )
}

export default Footer
