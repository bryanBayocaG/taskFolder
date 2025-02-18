import React from 'react'

function FobiddenPage() {
    return (
        <div className='m-auto flex h-full w-full items-center overflow-x-auto overflow-y-hidden px-2 justify-center'>
            <div className='flex flex-col'>
                <div className='text-center w-full '>
                    <p className='font-bold text-3xl lg:text-5xl'>
                        <span className='text-sky-500'>403</span>  - Access Forbidden
                    </p>
                </div>
                <br />
                <div>
                    <img
                        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWZjd2FmM204YXM2bWh3Z29yYnJlMmVjeHo0aXR0ZHphMWFua3U1diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/OkoScrMcY324r1j1HZ/giphy.gif"
                    />
                </div>
                <div className='flex justify-center'>
                    <a
                        className='border-slate-300 border-2 p-3 rounded-lg hover:border-sky-400  '
                        href="/"
                    >
                        Go back
                    </a>
                </div>
            </div>
        </div>
    )
}

export default FobiddenPage
