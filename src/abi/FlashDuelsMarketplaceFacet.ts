export const FlashDuelsMarketplaceFacet = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__AmountMustBeGreaterThanZero",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__BuyerCannotBeTheBot",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "duelId",
                "type": "string"
            }
        ],
        "name": "FlashDuelsMarketplaceFacet__DuelEnded",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__DuelNotBootStrappedOrLive",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__InsufficientTokenBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__InvalidBot",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__InvalidOption",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__MarketBuyNotAllowedForShortDurationDuels",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__MarketBuyNotAllowedYet",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__MismatchedArrayLengths",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__NoActiveSale",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__NotEnoughTokensAvailable",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__NotTheSeller",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__PricePerTokenMustBeGreaterThanZero",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__SellerCannotBuyOwnTokens",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FlashDuelsMarketplaceFacet__SellingNotAllowedForShortDurationDuels",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "LibDiamond__MustBeContractOwner",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "version",
                "type": "uint64"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "saleId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "saleCancelledTime",
                "type": "uint256"
            }
        ],
        "name": "SaleCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "saleId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "saleTime",
                "type": "uint256"
            }
        ],
        "name": "SaleCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenPurchasedTime",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "duelId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "enum DuelCategory",
                "name": "duelCategory",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "optionIndex",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "saleIds",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "name": "buy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "saleId",
                "type": "uint256"
            }
        ],
        "name": "cancelSell",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "saleId",
                "type": "uint256"
            }
        ],
        "name": "getSale",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "quantity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPrice",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Sale",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "duelId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "enum DuelCategory",
                "name": "duelCategory",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "optionIndex",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalPrice",
                "type": "uint256"
            }
        ],
        "name": "sell",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newBuyerFees",
                "type": "uint256"
            }
        ],
        "name": "updateBuyerFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newSellerFees",
                "type": "uint256"
            }
        ],
        "name": "updateSellerFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]