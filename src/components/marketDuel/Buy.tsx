// import { BetCardProps } from "@/utils/consts"
// import BetInfo from "../BettingModal/BetInfo"


// export const BuyComponent: React.FC<BetCardProps> = ({
//   betTitle,
//   imageUrl,
//   volume,
//   endTime,
//   percentage,
//   createdBy,
//   availableAmount,
//   onClose,
//   duelId,
//   duelType,
//   startAt,
//   createdAt,
//   asset,
//   totalBetAmount,
//   status,
//   endsIn,
//   triggerPrice,
//   setIsModalOpen,
// }) => {
//     return (
        
//       <div>
//          <div className="flex flex-col px-4 mt-4 w-full">
//                   <BetInfo
//                     bet={bet}
//                     setBet={setBet}
//                     status={status}
//                     betTitle={betTitle}
//                     imageUrl={imageUrl}
//                     volume={volume}
//                     endTime={endTime}
//                     probability={calculatedPercentage}
//                     createdBy={createdBy}
//                     startAt={startAt}
//                     createdAt={createdAt}
//                     totalBetAmount={totalBetAmount}
//                     noPrice={noPrice}
//                     yesPrice={yesPrice}
//                   />
//                   <div className="flex flex-col h-full justify-end">
//                     <BetAmount
//                       availableAmount={availableAmount}
//                       betAmount={betAmount}
//                       setBetAmount={setBetAmount}
//                     />
//                     <TransactionOverview betAmount={betAmount} />
//                     <PlaceBetButton
//                       betAmount={betAmount}
//                       duelId={duelId}
//                       duelType={duelType}
//                       bet={bet}
//                       asset={asset}
//                       triggerPrice={triggerPrice}
//                       endsIn={endsIn}
//                       setIsModalOpen={setIsModalOpen}
//                       markPrice={priceFormatted as number}
//                     />
//                   </div>
//                 </div>
//       </div>
//     )
// }