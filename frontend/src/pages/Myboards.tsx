import BoardCard from '@/components/BoardCard';
import { useAuthStore } from '@/store';
import { useEffect, useState } from 'react';
import FobiddenPage from './FobiddenPage';
import { Spinner } from '@heroui/react';
import ModalPopUp from '@/components/Modal';

function Myboards() {
    const currentAuth = useAuthStore((state) => state.currentAuth)
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        try {
            const fetchBoards = async () => {

            }
            // fetchBoards()
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("error fetching boards")
            }
        }

    })
    return (
        <>
            {currentAuth ?
                <>
                    {isLoading ?
                        <div className="flex h-full w-full justify-center px-2">
                            <Spinner size="lg" color="primary" />
                        </div>
                        :
                        <>
                            <div className='h-28' />
                            <div className='mx-6'>
                                <div>
                                    <ModalPopUp name='Add board' useFor='addBoard' />
                                </div>
                            </div>
                            <div className="grid justify-items-center mx-3 md:mx-6 lg:mx-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 overflow-x-hidden-hidden">
                                <div>
                                    <BoardCard />
                                </div>
                                <div>
                                    <BoardCard />
                                </div>
                                <div>
                                    <BoardCard />
                                </div>
                                <div>
                                    <BoardCard />
                                </div>
                                <div>
                                    <BoardCard />
                                </div>

                            </div>
                        </>
                    }

                </>
                :
                <FobiddenPage />
            }

        </>
    )
}

export default Myboards
