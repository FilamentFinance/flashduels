import { atom, useAtom } from "jotai";
import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoCheckmarkOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";


export const GeneralNotificationAtom = atom<{
  isOpen: boolean;
  success: boolean;
  massage: string;
}>({
  isOpen: true,
  success: false,
  massage: "Hello Hello Hello",
});

export const GeneralNotification = () => {
	const [isFaucetToasterOpen, setIsFaucetToasterOpenAtom] = useAtom(GeneralNotificationAtom)
	useEffect(() => {
		if (isFaucetToasterOpen.isOpen) {
			setTimeout(() => {
				setIsFaucetToasterOpenAtom({
					isOpen: false,
					success: false,
					massage: '',
				})
			}, 5000)
		}
	}, [isFaucetToasterOpen])

	return (
		<div>
			{isFaucetToasterOpen.isOpen && (
				<>
					<div className='fixed duration-500 w-[500px] h-fit flex justify-end items-start right-[2%] top-[2%] z-[9999]   max-[500px]:px-4'>
						<div className='failed_order-bg_popup !border-[#FFFFFF1A] !bg-[#262729] w-[300px] transform px-4 py-3 text-left align-middle shadow-xl transition-all'>
							<div className='w-full flex flex-row justify-between items-center'>
								<div className='flex items-center justify-start  gap-3 w-full'>
									<div
										className={`w-10 h-8 flex justify-center items-center rounded-full ${
											isFaucetToasterOpen.success
												? 'bg-[#10B981]'
												: 'bg-[#D65454]'
										}`}
									>
										{isFaucetToasterOpen.success ? (
											<IoCheckmarkOutline size={25} />
										) : (
											<RxCross1 size={22} />
										)}
									</div>
									<div className='text-white  w-full'>{isFaucetToasterOpen.massage}</div>
								</div>
								<button
									className=''
									onClick={() =>
										setIsFaucetToasterOpenAtom({
											isOpen: false,
											success: false,
											massage: '',
										})
									}
								>
									<AiOutlineClose className='text-base text-white' />
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}


