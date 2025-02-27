import BoardCard from '@/components/BoardCard';
import { useAuthStore } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import FobiddenPage from './FobiddenPage';
import { Spinner } from '@heroui/react';
import ModalPopUp from '@/components/Modal';
import { backEndBaseURL } from '@/utils/baseUrl';
import { BackEndBoardData, Board } from '@/type';

function Myboards() {
    const currentAuth = useAuthStore((state) => state.currentAuth)
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    const [boards, setBoards] = useState<Board[]>([])
    const [isLoading, setLoading] = useState(false);

    const fetchBoards = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backEndBaseURL}/api/user/${currentAuthUID}/board`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Fetching boards failed");

            const data = await res.json();
            const transFormData = data.data.map((board: BackEndBoardData) => ({
                id: board._id,
                boardName: board.boardName,
                description: board.description,
                boardImg: board.boardImg,
            }));

            setBoards(transFormData);
        } catch (error) {
            console.error("Error fetching boards:", error);
        } finally {
            setLoading(false);
        }
    }, [currentAuthUID]);

    useEffect(() => {
        fetchBoards()
    }, [fetchBoards])
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
                                    <ModalPopUp name='Add board' useFor='addBoard' fetchAgain={fetchBoards} />
                                </div>
                            </div>
                            <div className="min-h-[500px] grid justify-items-center mx-3 md:mx-6 lg:mx-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 overflow-x-hidden-hidden">
                                {boards?.map((board) => (
                                    <div key={board.id}>
                                        <BoardCard
                                            name={board.boardName}
                                            desc={board.description}
                                            id={board.id}
                                            img={board.boardImg}
                                        />
                                    </div>
                                ))}
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
