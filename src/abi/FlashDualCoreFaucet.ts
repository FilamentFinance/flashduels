export const FlashDuelCoreFaucetAbi = [
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
      "name": "FlashDuels__InvalidBot",
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
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "enum DuelCategory",
              "name": "category",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "topic",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "enum DuelDuration",
              "name": "duration",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
          }
      ],
      "name": "CreateDuelRequested",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "creator",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "tokenSymbol",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "createTime",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "createDuelFee",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "int256",
              "name": "triggerValue",
              "type": "int256"
          },
          {
              "indexed": false,
              "internalType": "enum TriggerType",
              "name": "triggerType",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "enum TriggerCondition",
              "name": "triggerCondition",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "enum DuelCategory",
              "name": "category",
              "type": "uint8"
          }
      ],
      "name": "CryptoDuelCreated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "tokenSymbol",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "option",
              "type": "string"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "participant",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "optionToken",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "optionIndex",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amountOptionToken",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "joinTime",
              "type": "uint256"
          }
      ],
      "name": "CryptoDuelJoined",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "enum DuelCategory",
              "name": "category",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "topic",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "enum DuelDuration",
              "name": "duration",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
          }
      ],
      "name": "DuelApprovedAndCreated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "duelCreateTime",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "duelCancelTime",
              "type": "uint256"
          }
      ],
      "name": "DuelCancelled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "topic",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "option",
              "type": "string"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "participant",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "optionToken",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "optionIndex",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amountOptionToken",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "joinTime",
              "type": "uint256"
          }
      ],
      "name": "DuelJoined",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "winningOption",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "optionIndex",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "settleTime",
              "type": "uint256"
          }
      ],
      "name": "DuelSettled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "expiryTime",
              "type": "uint256"
          }
      ],
      "name": "DuelStarted",
      "type": "event"
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
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "winningOption",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "optionIndex",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
          }
      ],
      "name": "PartialDuelSettled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
          }
      ],
      "name": "PartialRefundsDistributed",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
          }
      ],
      "name": "PartialWinningsDistributed",
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
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "option",
              "type": "string"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "recipient",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "refundTime",
              "type": "uint256"
          }
      ],
      "name": "RefundIssued",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
          }
      ],
      "name": "RefundsDistributionCompleted",
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
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "duelId",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
          }
      ],
      "name": "WinningsDistributionCompleted",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "creatorFee",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "withdrawCreatorEarningTime",
              "type": "uint256"
          }
      ],
      "name": "WithdrawCreatorEarning",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "withdrawEarningTime",
              "type": "uint256"
          }
      ],
      "name": "WithdrawEarning",
      "type": "event"
  },
  {
      "inputs": [
          {
              "internalType": "enum DuelCategory",
              "name": "_duelCategory",
              "type": "uint8"
          },
          {
              "internalType": "string",
              "name": "_duelId",
              "type": "string"
          }
      ],
      "name": "cancelDuelIfThresholdNotMet",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "continueRefundsInChunks",
      "outputs": [],
      "stateMutability": "nonpayable",
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
              "internalType": "string",
              "name": "_winningOption",
              "type": "string"
          }
      ],
      "name": "continueWinningsDistribution",
      "outputs": [],
      "stateMutability": "nonpayable",
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
          },
          {
              "internalType": "uint256",
              "name": "_optionsIndex",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "_optionPrice",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "_user",
              "type": "address"
          }
      ],
      "name": "joinCryptoDuel",
      "outputs": [],
      "stateMutability": "nonpayable",
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
          },
          {
              "internalType": "uint256",
              "name": "_optionsIndex",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "_optionPrice",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "_user",
              "type": "address"
          }
      ],
      "name": "joinDuel",
      "outputs": [],
      "stateMutability": "nonpayable",
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
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_tokenSymbol",
              "type": "string"
          },
          {
              "internalType": "string[]",
              "name": "_options",
              "type": "string[]"
          },
          {
              "internalType": "int256",
              "name": "_triggerValue",
              "type": "int256"
          },
          {
              "internalType": "enum TriggerType",
              "name": "_triggerType",
              "type": "uint8"
          },
          {
              "internalType": "enum TriggerCondition",
              "name": "_triggerCondition",
              "type": "uint8"
          },
          {
              "internalType": "enum DuelDuration",
              "name": "_duelDuration",
              "type": "uint8"
          }
      ],
      "name": "requestCreateCryptoDuel",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "enum DuelCategory",
              "name": "_category",
              "type": "uint8"
          },
          {
              "internalType": "string",
              "name": "_topic",
              "type": "string"
          },
          {
              "internalType": "string[]",
              "name": "_options",
              "type": "string[]"
          },
          {
              "internalType": "enum DuelDuration",
              "name": "_duelDuration",
              "type": "uint8"
          }
      ],
      "name": "requestCreateDuel",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "nonpayable",
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
              "internalType": "int256",
              "name": "_endTokenPrice",
              "type": "int256"
          }
      ],
      "name": "settleCryptoDuel",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "settleDuel",
      "outputs": [],
      "stateMutability": "nonpayable",
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
              "internalType": "int256",
              "name": "_startTokenPrice",
              "type": "int256"
          }
      ],
      "name": "startCryptoDuel",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "startDuel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "withdrawCreatorFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
          }
      ],
      "name": "withdrawEarnings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
]