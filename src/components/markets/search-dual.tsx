import { Input } from '@/shadcn/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface SearchDuelsProps {
  placeholder: string;
}

const SearchDuels: React.FC<SearchDuelsProps> = ({ placeholder }) => {
  return (
    <div className="flex gap-10 items-center px-5 py-2 rounded-xl border border-solid bg-white bg-opacity-0 border-white border-opacity-10 shadow-[0px_2px_10px_rgba(0,0,0,0.25)]">
      <label htmlFor="searchInput" className="sr-only">
        Search Duels
      </label>
      <Input
        id="searchInput"
        type="text"
        className="flex-grow bg-transparent text-xl text-stone-500  border-none outline-none active:outline-none"
        placeholder={placeholder}
      />
      <Search className="w-8 h-8 text-stone-500" />
    </div>
  );
};

export default SearchDuels;


// "seiTestnet": {
//   "FLASHUSDC": "0x542938B5c37d082159C0933EC982E3585c94BD62",
//   "FlashDuelsAdminFacet": "0x88498614Af73Ba8643C8190DBeDE42eff14EF102",
//   "FlashDuelsCoreFacet": "0x9c34E4e6c6075A35a23d13BF2d50ed5b1Af787a3",
//   "FlashDuelsMarketplaceFacet": "0x9faA711B06597BD3a757cFD716c52E72f035E11D",
//   "FlashDuelsViewFacet": "0xc4A1AE1234e39987c79aE14E00f2A98306C35236",
//   "OwnershipFacet": "0x65c36658c81EAed25f207C91a8A3F1e82E36ABd1",
//   "DiamondCutFacet": "0x54eB40902D7cb919EF28AbE286050Ecee2cB9b2B",
//   "DiamondLoupeFacet": "0x86AE9F81809D3cC09e80433c6E41F7fd98eD09AF",
//   "DiamondInit": "0x639FebBc3b0DF17e10b65E7B69138265A3e4648A",
//   "Diamond": "0x82f8b57891C7EC3c93ABE194dB80e4d8FC931F09",
//   "StartBlock": 150967382,
//   "Goldsky_Subgraph": ""
// },