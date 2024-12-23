import * as React from "react";
import { OrderItem } from "./OrderItem";
import { MarketStats } from "./MarketStats";
import ProbabilityBar from "../BettingModal/ProbabilityBar";
import { BetCardProps, NEXT_PUBLIC_API, OptionBetType } from "@/utils/consts";
import { useRouter } from "next/navigation";
import BetInfo from "../BettingModal/BetInfo";
import BetAmount from "../BettingModal/BetAmount";
// import TransactionOverview from "../BettingModal/TransactionOverview";
import PlaceBetButton from "../BettingModal/PlaceBetButton";
import { postPricingData, useTotalBets } from "@/app/optionPricing";
import { ethers } from "ethers";
import { useState } from "react";
import { usePrice } from "@/app/providers/PriceContextProvider";
import { calculateFlashDuelsOptionPrice } from "@/utils/flashDuelsOptionPricing";
import { priceIds } from "@/utils/helper";
import PriceModal from "../BettingModal/PriceModal";
import { apiClient } from "@/utils/apiClient";
import SellButton from "./SellButton";
import { useAtom } from "jotai";
import { GeneralNotificationAtom } from "../GeneralNotification";
import { OrdersTable } from "./orders/OrdersTable";
import { DetailsModal } from "./details/DetailsModal";

// const yesOrders = [
//   { price: "$0.56", amount: "4000", type: "YES" },
//   { price: "$0.56", amount: "4000", type: "YES" },
//   { price: "$0.56", amount: "4000", type: "YES" },
//   { price: "$0.56", amount: "4000", type: "YES" },
//   { price: "$0.56", amount: "4000", type: "YES" },
// ];

// const noOrders = [
//   { price: "$0.245", amount: "4000", type: "NO" },
//   { price: "$0.12", amount: "4000", type: "NO" },
// ];

export const MarketDuel: React.FC<BetCardProps> = ({
  betTitle,
  imageUrl,
  volume,
  endTime,
  percentage,
  createdBy,
  availableAmount,
  onClose,
  duelId,
  duelType,
  startAt,
  createdAt,
  asset,
  totalBetAmount,
  status,
  endsIn,
  triggerPrice,
  setIsModalOpen,
}) => {
  console.log(onClose, "onClose");
  const [side, setSide] = useState("BUY");
  const thirtyMinutesMs = 30 * 60 * 1000;
  const durationMs = endTime * 60 * 60 * 1000; // duration in hours converted to milliseconds
  const router = useRouter();
  const [betsData, setBetsData] = useState([]);
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);

  // console.log(totalBetAmount, betsData, "bets-data-here");

  const [time, setTimeLeft] = React.useState("");
  const [priceOfBet, setPriceOfBet] = React.useState("0.00");
  const [betOptionId, setBetOptionId] = React.useState("");
  // console.log(percentage, "probability")
  // Function to calculate the remaining time
  const calculateRemainingTime = () => {
    const currentTimeMs = Date.now();
    const startTimeMs = createdAt * 1000;

    let remainingTimeMs;

    // Check if 30 minutes have passed since createdAt
    const timeElapsedMs = currentTimeMs - startTimeMs;
    if (timeElapsedMs > thirtyMinutesMs || status === 0) {
      // Use startAt if 30 minutes have passed
      const startAtTimeMs = startAt * 1000;
      const timeSinceStartAt = currentTimeMs - startAtTimeMs;
      remainingTimeMs = Math.max(durationMs - timeSinceStartAt, 0); // Calculate remaining time from startAt
    } else {
      // Use createdAt if 30 minutes have not passed
      remainingTimeMs = Math.max(thirtyMinutesMs - timeElapsedMs, 0); // Calculate remaining time from createdAt
    }

    return remainingTimeMs;
  };
  console.log(notification)

  // Function to format time in HH:MM:SS format
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const padTime = (time: number) => time.toString().padStart(2, "0");
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };
  const [betAmount, setBetAmount] = useState("1000");
  const [betState, setBetState] = useState<string>("YES");
  const [yesBets, setYesBets] = useState<OptionBetType[]>([]);
  const [noBets, setNoBets] = useState<OptionBetType[]>([]);
  // const [markPrice, setMarkPrice] = useState<number | null>(null);
  const [noPrice, setNoPrice] = useState<number>();
  const [yesPrice, setYesPrice] = useState<number>();
  const { prices } = usePrice();
  // Assuming useTotalBets is defined elsewhere
  const { totalBetYes, totalBetNo } = useTotalBets(duelId);

  const marketPlaceList = async () => {
    try {
      const response = await apiClient.get(
        `${NEXT_PUBLIC_API}/marketPlace/list/${duelId}`,
      );
      const data = response.data;
      const yesBets = data.filter((bet: OptionBetType) => bet.betOption?.index === 0)
      console.log(data[0].betOption, "Bet-Option", yesBets)
      const noBets = data.filter((bet: OptionBetType) => bet.betOption?.index === 1)
      setYesBets(yesBets);
      setNoBets(noBets);
    } catch (error) {
      console.error("Error fetching bet:", error);
    }
  };
  console.log(yesBets, "yesBets", noBets, "noBets");

  React.useEffect(() => { marketPlaceList() }, [duelId])

  const calculatedPercentage =
    ((totalBetYes as number) / ((totalBetYes as number) + Number(totalBetNo))) *
    100;
  console.log(
    calculatedPercentage,
    percentage,
    "calculated",
    totalBetYes,
    totalBetNo,
    duelId
  );
  const id = asset
    ? priceIds.find((obj) => obj[asset as keyof typeof obj])?.[
    asset as keyof (typeof priceIds)[0]
    ]
    : undefined;
  const formattedId = id?.startsWith("0x") ? id.slice(2) : id;
  const price = formattedId && prices[formattedId];
  const priceFormatted = Number(ethers.formatUnits(String(price || 0), 8));

  const handleBuyOrders = async (betOptionMarketId: string) => {
    try {
      const response = await apiClient.post(
        `${NEXT_PUBLIC_API}/betOption/buy`,
        { duelId, betOptionMarketId },
      );
      const data = response.data;

      console.log(data, "data-new")
      setNotification({
        isOpen: true,
        success: true,
        massage: data,
      })

    } catch (error) {
      console.error("Error fetching bet:", error);
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Purchase Bet",
      });
    }
  }
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenModal = () => setIsDetailsModalOpen(true);
  const handleCloseModal = () => setIsDetailsModalOpen(false);
  React.useEffect(() => {
    const fetchPrices = async () => {
      if (asset) {
        try {
          // const price = await getCryptoPrices(asset);
          const timePeriod = endsIn / (365 * 24);
          console.log(
            timePeriod,
            triggerPrice,
            priceFormatted,
            asset,
            totalBetNo,
            totalBetYes,
            "timePeriod"
          );
          const pricingValue = await postPricingData(
            priceFormatted as number,
            Number(triggerPrice),
            asset,
            timePeriod,
            totalBetYes || 0,
            totalBetNo || 0
          );
          setNoPrice(pricingValue["No Price"]);
          setYesPrice(pricingValue["Yes Price"]);
          console.log(
            pricingValue,
            triggerPrice,
            "pricingValue",
            pricingValue["No Value"],
            pricingValue["Yes Value"]
          );
        } catch (error) {
          console.error("Error fetching prices:", error);
        }
      } else {
        const timePeriod = endsIn / 24;
        console.log("no asset - its a flashduel");
        const pricingValue = calculateFlashDuelsOptionPrice(
          timePeriod < 1 ? 1 : timePeriod,
          totalBetNo || 0,
          totalBetYes || 0
        );
        setNoPrice(pricingValue["priceNo"]);
        setYesPrice(pricingValue["priceYes"]);
      }
    };

    fetchPrices();
  }, [asset, endsIn, triggerPrice, totalBetYes, totalBetNo, duelId]);

  const getBets = async () => {
    try {
      const response = await apiClient.post(
        `${NEXT_PUBLIC_API}/bets/getByUser`,
        { duelId: duelId }
      );
      console.log("hello-getBets");
      console.log(response, "response");
      const data = response.data;
      console.log(data.bets[0].options, "optionsData");
      setBetsData(data.bets[0].options);
    } catch (error) {
      console.error("Error fetching bet:", error);
    }
  };

  React.useEffect(() => {
    if (side === "SELL") {
      getBets();
    }
  }, [side]);
  // Update timeLeft every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const remainingTimeMs = calculateRemainingTime();
      setTimeLeft(formatTime(remainingTimeMs)); // Update state with formatted time
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [createdAt, startAt, endTime]);
  return (
    <div className="flex overflow-hidden flex-col pb-9">
      {/* Main content */}
      <main className="flex flex-col px-12 mt-6 gap-y-2 w-full max-md:px-5 max-md:max-w-full">
        <button
          className="flex gap-1 items-center self-start text-xl font-semibold tracking-normal leading-none text-center whitespace-nowrap text-stone-500"
          aria-label="Go back"
          onClick={() => router.push("/")}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/c0421d2e17b44204142803774498a75025c7bc02440d0c72f5b117e7c4737ad8?apiKey=0079b6be27434c51a81de1c6567570a7&"
            className="object-contain shrink-0 self-stretch my-auto w-7 rounded-full"
            alt=""
          />
          <span className="self-stretch my-auto">Back</span>
        </button>

        <div className="mt-3 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            {/* Market information section */}
            <section className="flex flex-col w-[67%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col w-full max-md:mt-2 max-md:max-w-full">
                {/* Market header */}
                <div className="flex flex-wrap gap-2 items-start w-full max-md:max-w-full">
                  <div className="flex gap-2 min-h-[87px] w-[87px]">
                    <div className="flex flex-1 shrink basis-0 size-full">
                      <div className="flex flex-1 shrink justify-center items-center bg-gray-500 rounded-full border border-solid basis-0 border-white border-opacity-10 h-[87px] w-[87px]">
                        <img
                          loading="lazy"
                          src={imageUrl}
                          className="object-contain flex-1 shrink rounded-full w-[87px]"
                          alt="Market icon"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap flex-1 shrink gap-1 font-semibold basis-0 min-w-[240px] max-md:max-w-full">
                    <h1 className="flex-1 shrink gap-2.5 self-stretch my-auto text-2xl leading-none text-white basis-4 min-w-[240px] max-md:max-w-full">
                      {betTitle || "Hello"}
                    </h1>
                    <button
                     onClick={handleOpenModal}
                      className="flex gap-1 items-center px-2 py-1 h-full text-xs tracking-normal leading-relaxed text-gray-400 rounded border border-solid bg-neutral-700 border-white border-opacity-10"
                      aria-label="View market details and rules"
                    >
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/23cdde72e8848561e1353e825434760a671422829515a5c8cc5fa63cfc5eee72?apiKey=0079b6be27434c51a81de1c6567570a7&"
                        className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                        alt=""
                      />
                      <span>Details & Rules</span>
                    </button>
                  </div>
                </div>
                <DetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseModal} />

                {/* Market stats */}
                <div className="flex flex-wrap gap-4 items-center mt-4 w-full max-md:mr-1 max-md:max-w-full">
                  {/* <MarketStats label="Total Bets" value="$200.64K" />
                  <MarketStats label="Open Bets" value="567K" suffix="Shares" /> */}
                  <MarketStats label="Liquidity" value={volume} />
                  <MarketStats label="Ends in" value={time} />

                  <div className="flex flex-col flex-1 shrink justify-center items-center self-stretch my-auto basis-0">
                    <div className="flex flex-col justify-center w-[62px]">
                      {/* <div className="flex flex-col justify-center w-full h-9"> */}
                      {/* <div className="self-center text-xl font-semibold leading-none text-lime-300">
                          60 %
                        </div> */}
                      {/* Progress bar */}
                      {/* <div className="flex gap-0.5 mt-1 w-full min-h-[13px]">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex flex-1 shrink w-1 ${
                                i < 6
                                  ? "bg-lime-300"
                                  : "bg-gray-500 bg-opacity-30"
                              } rounded-xl basis-0 h-[13px] ${
                                i % 5 === 4 ? "w-[5px]" : ""
                              }`}
                            />
                          ))}
                        </div> */}
                      {/* </div> */}
                      <ProbabilityBar probability={percentage || 50} />
                    </div>
                  </div>
                </div>

                {/* Order book */}
                <div className="flex overflow-hidden flex-wrap items-start py-1 mt-7 text-base tracking-normal rounded-xl border-2 border-solid bg-neutral-900 border-stone-900">
                  {/* Yes orders */}
                 {yesBets.length === 0  && noBets.length === 0 ?    <span className="text-white flex items-center justify-center h-[441px] w-full">No Open Orders</span> :
                 <>
                  <div className="flex flex-col flex-1 self-stretch mt-2">
                    <div className="flex items-center w-full whitespace-nowrap text-stone-200">
                      <div className="flex gap-2.5 items-start self-stretch py-2 pl-3.5 my-auto border-b-2 border-stone-900 w-[97px]">
                        <div className="flex gap-2 items-start w-[139px]">
                          <div className="flex flex-col w-[139px]">
                            <div className="gap-1 self-stretch w-full text-ellipsis">
                              Price
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 shrink gap-2.5 items-start self-stretch py-2 my-auto border-b-2 basis-[13px] border-stone-900 min-w-[240px]">
                        <div className="flex gap-2 items-start w-[139px]">
                          <div className="flex flex-col flex-1 shrink w-full basis-0">
                            <div className="flex-1 shrink gap-1 self-stretch w-full text-ellipsis">
                              Quantity
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-1.5 w-full h-[388px]">
                      {yesBets.map((order: OptionBetType, index) => (
                        <OrderItem
                          key={index}
                          price={order.price}
                          amount={order.quantity}
                          type={"YES"}
                          onBuy={() => handleBuyOrders(order.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 w-0.5 border-2 border-solid border-stone-900 h-[441px]" />

                  {/* No orders */}
                  <div className="flex flex-col flex-1 mt-2">
                    <div className="flex items-center w-full whitespace-nowrap text-stone-200">
                      <div className="flex gap-2.5 items-start self-stretch py-2 pl-3.5 my-auto border-b-2 border-stone-900 w-[97px]">
                        <div className="flex gap-2 items-start w-[139px]">
                          <div className="flex flex-col w-[139px]">
                            <div className="gap-1 self-stretch w-full text-ellipsis">
                              Price
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 shrink gap-2.5 items-start self-stretch py-2 my-auto border-b-2 basis-[13px] border-stone-900 min-w-[240px]">
                        <div className="flex gap-2 items-start w-[139px]">
                          <div className="flex flex-col flex-1 shrink w-full basis-0">
                            <div className="flex-1 shrink gap-1 self-stretch w-full text-ellipsis">
                              Amount
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-1.5 w-full">
                      {noBets.map((order: OptionBetType, index) => (
                        <OrderItem
                          key={index}
                          price={order.price}
                          amount={order.quantity}
                          type={"NO"}
                          onBuy={() => handleBuyOrders(order.id)}

                        />
                      ))}
                    </div>
                  </div>
                 </>
                 }
                </div>
              </div>
            </section>

            {/* Order form section */}
            <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col py-2 mx-auto w-full rounded-lg border-2 border-solid shadow-sm bg-neutral-900 border-white border-opacity-10 min-h-[624px] max-md:mt-2">
                {/* Form tabs */}
                <div className="flex gap-5 items-start px-5 w-full text-xl font-semibold whitespace-nowrap border-b-2 border-white border-opacity-10">
                  <button
                    className={`flex flex-col justify-center ${side === "BUY"
                      ? "text-pink-300 border-b-2 border-pink-300"
                      : "rounded-lg text-zinc-700"
                      }`}
                    aria-label="Switch to buy tab"
                    onClick={() => setSide("BUY")}
                  >
                    <div className="flex gap-2 items-center py-2">
                      <div className="gap-2 self-stretch my-auto">Buy</div>
                    </div>
                  </button>
                  <button
                    className={`flex flex-col justify-center ${side === "SELL"
                      ? "text-pink-300 border-b-2 border-pink-300"
                      : "rounded-lg text-zinc-700"
                      } `}
                    aria-label="Switch to sell tab"
                    onClick={() => setSide("SELL")}
                  >
                    <div className="flex gap-2 items-center py-2">
                      <div className="gap-2 self-stretch my-auto">Sell</div>
                    </div>
                  </button>
                </div>

                {side === "BUY" ? (
                  <>
                    <div className="flex flex-col px-4 mt-4 w-full">
                      <BetInfo
                        bet={betState}
                        setBet={setBetState}
                        status={status}
                        betTitle={betTitle}
                        imageUrl={imageUrl}
                        volume={volume}
                        endTime={endTime}
                        probability={calculatedPercentage}
                        createdBy={createdBy}
                        startAt={startAt}
                        createdAt={createdAt}
                        totalBetAmount={totalBetAmount}
                        noPrice={noPrice}
                        yesPrice={yesPrice}
                      />
                      <div className="flex flex-col h-full justify-end">
                        <BetAmount
                          availableAmount={availableAmount}
                          betAmount={betAmount}
                          setBetAmount={setBetAmount}
                          text={"Amount"}
                          showAvailable={true}
                          showUSDC={true}
                        />
                        {/* Order summary */}

                      </div>
                      <div className="flex gap-3 items-end p-2 mt-3 w-full text-sm tracking-normal leading-none text-gray-400 rounded border border-solid bg-neutral-900 border-white border-opacity-10">
                        <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
                          <div className="flex gap-10 justify-between items-center mt-1 w-full">
                            <div className="flex flex-col items-start self-stretch my-auto w-[91px]">
                              <div>{betState === "YES" ? (Number(betAmount) * Number(yesPrice)).toFixed(2) : (Number(betAmount) * Number(noPrice)).toFixed(2)} {betState}</div>
                            </div>
                            <div className="flex flex-col self-stretch my-auto whitespace-nowrap">
                              <div>${betState === "YES" ? (yesPrice)?.toFixed(2) : (noPrice)?.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <PlaceBetButton
                        betAmount={betAmount}
                        duelId={duelId}
                        duelType={duelType}
                        bet={betState}
                        asset={asset}
                        triggerPrice={triggerPrice}
                        endsIn={endsIn}
                        setIsModalOpen={setIsModalOpen}
                        markPrice={priceFormatted as number}
                      />
                    </div>

                    {/* Match market orders toggle */}
                    {/* <div className="flex items-center mt-3 w-full">
                      <div className="flex flex-1 shrink gap-2 items-center self-stretch my-auto w-full rounded-lg basis-0 min-w-[240px]">
                        <label className="flex gap-2.5 items-center self-stretch my-auto w-4">
                          <input
                            type="checkbox"
                            className="hidden"
                            aria-label="Match market orders"
                          />
                          <div className="flex overflow-hidden justify-center items-center self-stretch my-auto w-4 h-4 bg-pink-300 rounded border border-solid border-pink-300 border-opacity-60 min-h-[16px]">
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/2d84382d7a37b16c1d5e2a3a2db49814b8cbc0e8a36a591e566745fc640a27ef?apiKey=0079b6be27434c51a81de1c6567570a7&"
                              className="object-contain self-stretch my-auto w-3.5 aspect-square"
                              alt=""
                            />
                          </div>
                        </label>
                        <div className="self-stretch pt-0.5 my-auto w-36 text-sm font-medium tracking-normal leading-none text-white">
                          Match Market Orders
                        </div>
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/a57915f697782d6642a6220d20312f1518adeeed663a49a5b001ab1e95e81fd8?apiKey=0079b6be27434c51a81de1c6567570a7&"
                          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                          alt=""
                        />
                      </div>
                    </div> */}



                    {/* Order details */}
                    {/* <div className="flex flex-col justify-center mt-3 w-full text-sm tracking-normal leading-none">
                      <div className="flex gap-10 justify-between items-center w-full text-gray-400">
                        <div className="flex flex-col items-start self-stretch my-auto w-[91px]">
                          <div>Avg. Price</div>
                        </div>
                        <div className="flex flex-col self-stretch my-auto whitespace-nowrap">
                          <div>$0.56</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1 w-full">
                        <div className="flex gap-1 items-center self-stretch my-auto text-gray-400 whitespace-nowrap min-w-[240px] w-[326px]">
                          <div className="flex flex-col items-start self-stretch my-auto w-[91px]">
                            <div>Order</div>
                          </div>
                        </div>
                        <div className="flex flex-col self-stretch my-auto text-gray-400">
                          <div>
                            2000 <span className="text-gray-400">YES</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-10 justify-between items-center mt-1 w-full">
                        <div className="flex flex-col items-start self-stretch my-auto text-gray-400 w-[91px]">
                          <div>Potential Return</div>
                        </div>
                        <div className="flex flex-col self-stretch my-auto text-lime-300 whitespace-nowrap">
                          <div>$2500(40%)</div>
                        </div>
                      </div>
                    </div> */}
                    {/* </div>  */}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col px-4 mt-4 w-full">
                      <BetInfo
                        bet={betState}
                        setBet={setBetState}
                        status={status}
                        betTitle={betTitle}
                        imageUrl={imageUrl}
                        volume={volume}
                        endTime={endTime}
                        probability={calculatedPercentage}
                        createdBy={createdBy}
                        startAt={startAt}
                        createdAt={createdAt}
                        totalBetAmount={totalBetAmount}
                        noPrice={noPrice}
                        yesPrice={yesPrice}
                      />
                      <div className="flex flex-col h-full justify-end">
                        <BetAmount
                          availableAmount={availableAmount}
                          betAmount={betAmount}
                          setBetAmount={setBetAmount}
                          text={"Quantity"}
                          showAvailable={false}
                          showUSDC={false}
                        />
                        <PriceModal
                          priceOfBet={priceOfBet}
                          setPriceOfBet={setPriceOfBet}
                        />
                        {/* <TransactionOverview betAmount={betAmount} /> */}

                        <div className="rounded-lg shadow-lg mt-2">
                          <h3 className="text-gray-400">
                            Your Bets
                          </h3>
                          {betsData.map((bet: OptionBetType, index: number) => (

                            <button
                              key={index}
                              onClick={() => {
                                if (betState === "NO" && bet.index === 1) {
                                  setBetAmount((Number(bet.quantity)).toString());
                                  setPriceOfBet(bet.price);
                                  setBetOptionId(bet.id)

                                }
                                else if (betState === "YES" && bet.index === 0) {
                                  setBetAmount((Number(bet.quantity)).toString());
                                  setPriceOfBet(bet.price);
                                  setBetOptionId(bet.id)
                                }
                              }}
                              className="flex mt-1 items-end p-2 w-full text-sm tracking-normal leading-none text-gray-400 rounded border border-solid bg-neutral-900 border-white border-opacity-10">
                              {/* <div className="flex gap-3 items-end p-2 mt-3 w-full text-sm tracking-normal leading-none text-gray-400 rounded border border-solid bg-neutral-900 border-white border-opacity-10"> */}
                              <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
                                <div className="flex gap-10 justify-between items-center mt-1 w-full">
                                  <div className="flex flex-col items-start self-stretch my-auto w-[91px]">
                                    <div>{Number(bet.quantity).toFixed(3)} {bet.index === 0 ? "YES" : "NO"}</div>
                                  </div>
                                  <div className="flex flex-col self-stretch my-auto whitespace-nowrap">
                                    <div>${Number(bet.price).toFixed(3)}</div>
                                  </div>
                                </div>
                              </div>
                            </button>

                          ))}
                        </div>
                        {/* //sc interaction */}
                        <SellButton
                          quantity={betAmount}
                          price={priceOfBet}
                          betOptionId={betOptionId}
                          optionIndex={betState === "YES" ? 0 : 1}
                          duelId={duelId}
                        />
                      </div>
                    </div>
                    {/* <div></div> */}
                  </>
                )}
              </div>
            </section>

          </div>

        </div>
        {/* OpenOrders */}
        <OrdersTable></OrdersTable>

      </main>
    </div>
  );
};
