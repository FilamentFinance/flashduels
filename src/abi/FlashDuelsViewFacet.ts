export const FlashDuelsViewFacetABI = [
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotInitializing",
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
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "checkIfThresholdMet",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllPendingDuelsAndCount",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "enum DuelCategory",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "topic",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "options",
                        "type": "string[]"
                    },
                    {
                        "internalType": "enum DuelDuration",
                        "name": "duration",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "usdcAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PendingDuel[]",
                "name": "",
                "type": "tuple[]"
            },
            {
                "internalType": "uint256",
                "name": "allPendingDuelsLength",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getAllTimeEarnings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBootstrapPeriod",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBotAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCreateDuelFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCreatorFeePercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_creator",
                "type": "address"
            }
        ],
        "name": "getCreatorFeesEarned",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "getCreatorToDuelIds",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCreditsAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "getCryptoDuel",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "tokenSymbol",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiryTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "int256",
                        "name": "triggerValue",
                        "type": "int256"
                    },
                    {
                        "internalType": "enum TriggerType",
                        "name": "triggerType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum TriggerCondition",
                        "name": "triggerCondition",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum DuelDuration",
                        "name": "duelDuration",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum DuelStatus",
                        "name": "duelStatus",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct CryptoDuel",
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
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "getDuel",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "topic",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiryTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum DuelDuration",
                        "name": "duelDuration",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum DuelStatus",
                        "name": "duelStatus",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum DuelCategory",
                        "name": "category",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct Duel",
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
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "getDuelIdToOptions",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "getDuelIdToTokenSymbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_option",
                "type": "string"
            }
        ],
        "name": "getDuelUsersForOption",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "getDuels",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "topic",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiryTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum DuelDuration",
                        "name": "duelDuration",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum DuelStatus",
                        "name": "duelStatus",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum DuelCategory",
                        "name": "category",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct Duel",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLiveDuelIds",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMaxAutoWithdraw",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMaxLiquidityCapAcrossProtocol",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMaxLiquidityCapPerDuel",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMinThreshold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMinWagerTradeSize",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_optionIndex",
                "type": "uint256"
            }
        ],
        "name": "getOptionIndexToOptionToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getParticipationTokenType",
        "outputs": [
            {
                "internalType": "enum ParticipationTokenType",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "enum DuelCategory",
                "name": "_category",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getPendingDuelByIndex",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "enum DuelCategory",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "topic",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "options",
                        "type": "string[]"
                    },
                    {
                        "internalType": "enum DuelDuration",
                        "name": "duration",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "usdcAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PendingDuel",
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
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "enum DuelCategory",
                "name": "_category",
                "type": "uint8"
            }
        ],
        "name": "getPendingDuels",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "enum DuelCategory",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "topic",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "options",
                        "type": "string[]"
                    },
                    {
                        "internalType": "enum DuelDuration",
                        "name": "duration",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "usdcAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PendingDuel[]",
                "name": "",
                "type": "tuple[]"
            },
            {
                "internalType": "uint256",
                "name": "pendingDuelsLength",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_tokenSymbol",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "_currentOraclePrice",
                "type": "int256"
            }
        ],
        "name": "getPriceDelta",
        "outputs": [
            {
                "internalType": "int256",
                "name": "endPrice",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "startPrice",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "delta",
                "type": "int256"
            },
            {
                "internalType": "bool",
                "name": "isEndPriceGreater",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getProtocolFeePercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getProtocolTreasury",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRefundChunkSize",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getResolvingPeriod",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSaleCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "optionToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "saleId",
                "type": "uint256"
            }
        ],
        "name": "getSales",
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
        "inputs": [],
        "name": "getSellerAndBuyerFees",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_optionsIndex",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_option",
                "type": "string"
            }
        ],
        "name": "getTotalBetsOnOption",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalProtocolFeesGenerated",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalProtocolLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUsdcAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_optionIndex",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserDuelOptionShare",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "optionShare",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_requestId",
                "type": "uint256"
            }
        ],
        "name": "getUserWithdrawalRequest",
        "outputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "enum WithdrawalStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getWagerAmountDeposited",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_optionsLength",
                "type": "uint256"
            },
            {
                "internalType": "string[]",
                "name": "_options",
                "type": "string[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_wagerAmountsForOptions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWinnersChunkSize",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getWithdrawalRequestIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_offset",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_limit",
                "type": "uint256"
            }
        ],
        "name": "getWithdrawalRequestIdsPaginated",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "isDuelLive",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "isRefundInProgress",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_duelId",
                "type": "string"
            }
        ],
        "name": "isValidDuelId",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]