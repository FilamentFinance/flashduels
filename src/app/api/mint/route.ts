// import { NextApiRequest } from "next";
import { NEXT_PUBLIC_FLASH_USDC, NEXT_PUBLIC_RPC_URL } from "@/utils/consts";
import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { ethers } from "ethers";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  // res: NextResponse
) {
    try {
      const { address } = await req.json();

      if (!process.env.PRIVATE_KEY || !NEXT_PUBLIC_RPC_URL) {
        return NextResponse.json({ message: 'Server Enviornment Not configured Correctly' }, { status: 500 }, );
      }

      const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_RPC_URL);

      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      console.log(address, 'address' , NEXT_PUBLIC_RPC_URL, 'NEXT_PUBLIC_RPC_URL', process.env.PRIVATE_KEY, 'process  env')

      const contract = new ethers.Contract(
        NEXT_PUBLIC_FLASH_USDC,
        FLASHUSDCABI,
        wallet
      );

      const tx = await contract.faucetMint(address);
      const resp = await tx.wait();

      if (resp.status !== 1) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 }, );
      }


      return NextResponse.json({ message: 'Minted Faucet Successfully' }, { status: 200 }, );
    } catch (error) {
      console.log(error)
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 }, );
    }
  }
// }
