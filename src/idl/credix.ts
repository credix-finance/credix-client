export type Credix = {
  "version": "0.1.0",
  "name": "credix",
  "instructions": [
    {
      "name": "initializeMarket",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatekeeperNetwork",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signingAuthorityBump",
          "type": "u8"
        },
        {
          "name": "globalMarketStateBump",
          "type": "u8"
        },
        {
          "name": "globalMarketSeed",
          "type": "string"
        },
        {
          "name": "interestFee",
          "type": {
            "defined": "Ratio"
          }
        },
        {
          "name": "withdrawalFee",
          "type": {
            "defined": "Ratio"
          }
        }
      ]
    },
    {
      "name": "depositFunds",
      "accounts": [
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createDeal",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "borrowerInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "deal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "dealBump",
          "type": "u8"
        },
        {
          "name": "borrowerInfoBump",
          "type": "u8"
        },
        {
          "name": "principal",
          "type": "u64"
        },
        {
          "name": "financingFeePercentage",
          "type": {
            "defined": "Ratio"
          }
        },
        {
          "name": "leverageRatio",
          "type": "u8"
        },
        {
          "name": "underwriterPerformanceFeePercentage",
          "type": {
            "defined": "Ratio"
          }
        },
        {
          "name": "timeToMaturityDays",
          "type": "u16"
        },
        {
          "name": "dealName",
          "type": "string"
        }
      ]
    },
    {
      "name": "activateDeal",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "deal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "makeDealRepayment",
      "accounts": [
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "repaymentType",
          "type": {
            "defined": "DealRepaymentType"
          }
        }
      ]
    },
    {
      "name": "withdrawFunds",
      "accounts": [
        {
          "name": "investor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "baseWithdrawalAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "passBump",
          "type": "u8"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        },
        {
          "name": "releaseTimestamp",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        },
        {
          "name": "releaseTimestamp",
          "type": "i64"
        }
      ]
    },
    {
      "name": "freezeGlobalMarketState",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "thawGlobalMarketState",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "borrowerInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numOfDeals",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "deal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "borrower",
            "type": "publicKey"
          },
          {
            "name": "principal",
            "type": "u64"
          },
          {
            "name": "financingFeePercentage",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "principalAmountRepaid",
            "type": "u64"
          },
          {
            "name": "interestAmountRepaid",
            "type": "u64"
          },
          {
            "name": "timeToMaturityDays",
            "type": "u16"
          },
          {
            "name": "goLiveAt",
            "type": "i64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "leverageRatio",
            "type": "u8"
          },
          {
            "name": "underwriterPerformanceFeePercentage",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "dealNumber",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lateFees",
            "type": "u64"
          },
          {
            "name": "lateFeesRepaid",
            "type": "u64"
          },
          {
            "name": "private",
            "type": "bool"
          },
          {
            "name": "defaulted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "globalMarketState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gatekeeperNetwork",
            "type": "publicKey"
          },
          {
            "name": "liquidityPoolTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "lpTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "totalOutstandingCredit",
            "type": "u64"
          },
          {
            "name": "treasuryPoolTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "signingAuthorityBump",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "interestFee",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "withdrawalFee",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "frozen",
            "type": "bool"
          },
          {
            "name": "seed",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "credixPass",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isBorrower",
            "type": "bool"
          },
          {
            "name": "isUnderwriter",
            "type": "bool"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "releaseTimestamp",
            "type": "i64"
          },
          {
            "name": "user",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Ratio",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numerator",
            "type": "u32"
          },
          {
            "name": "denominator",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "DealRepaymentType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Interest"
          },
          {
            "name": "Principal"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DealCreationEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DealActivationEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalOutstandingCredit",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DealInterestRepaymentEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpTokenPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DealPrincipalRepaymentEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalOutstandingCredit",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "investor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "investorLpTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpTokenSupply",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DepositEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "investor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "investorLpTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpTokenSupply",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPrincipalAmount",
      "msg": "This amount is not sufficient as a principal amount."
    },
    {
      "code": 6001,
      "name": "InvalidInterestAmount",
      "msg": "This amount is not sufficient as an interest amount."
    },
    {
      "code": 6002,
      "name": "DealNotLive",
      "msg": "This deal is not live yet."
    },
    {
      "code": 6003,
      "name": "InvalidDealRepaymentType",
      "msg": "Invalid deal repayment type."
    },
    {
      "code": 6004,
      "name": "NotEnoughLiquidity",
      "msg": "Not enough liquidity."
    },
    {
      "code": 6005,
      "name": "PrincipalRepaid",
      "msg": "Principal is already repaid."
    },
    {
      "code": 6006,
      "name": "InterestRepaid",
      "msg": "Interest is already repaid."
    },
    {
      "code": 6007,
      "name": "UnauthorizedSigner",
      "msg": "The Signer is not authorized to use this instruction."
    },
    {
      "code": 6008,
      "name": "CredixPassInvalid",
      "msg": "Credix pass is invalid for this request."
    },
    {
      "code": 6009,
      "name": "CredixPassInactive",
      "msg": "Credix pass is inactive at the moment."
    },
    {
      "code": 6010,
      "name": "Overflow",
      "msg": "Overflow occured."
    },
    {
      "code": 6011,
      "name": "Underflow",
      "msg": "Underflow occured."
    },
    {
      "code": 6012,
      "name": "ZeroDivision",
      "msg": "Tried to divide by zero."
    },
    {
      "code": 6013,
      "name": "ZeroDenominator",
      "msg": "Invalid Ratio: denominator can't be zero."
    },
    {
      "code": 6014,
      "name": "InvalidPreciseNumber",
      "msg": "Invalid u64 used as value for PreciseNumber."
    },
    {
      "code": 6015,
      "name": "PreciseNumberCastFailed",
      "msg": "Unable to cast PreciseNumber to u64"
    },
    {
      "code": 6016,
      "name": "NotEnoughLPTokens",
      "msg": "Not enough LP tokens."
    },
    {
      "code": 6017,
      "name": "NotEnoughBaseTokens",
      "msg": "Not enough Base tokens."
    },
    {
      "code": 6018,
      "name": "InterestBeforePrincipal",
      "msg": "Repay interest before principal."
    },
    {
      "code": 6019,
      "name": "MarketIsFrozen",
      "msg": "This market is currently frozen. Please try again later."
    },
    {
      "code": 6020,
      "name": "InvalidBorrowerTokenAccount",
      "msg": "Invalid Borrower Token Account."
    },
    {
      "code": 6021,
      "name": "InvalidBorrowerAccount",
      "msg": "Invalid Borrower Account."
    },
    {
      "code": 6022,
      "name": "InvalidGatewayToken",
      "msg": "Invalid Gateway token."
    },
    {
      "code": 6023,
      "name": "DealAlreadyActive",
      "msg": "Deal is already active."
    },
    {
      "code": 6024,
      "name": "InvalidInvestorTokenAccount",
      "msg": "Invalid Investor Token Account."
    },
    {
      "code": 6025,
      "name": "InvalidTokenAccountMint",
      "msg": "Invalid mint for Token Account."
    },
    {
      "code": 6026,
      "name": "InvalidMintAccount",
      "msg": "Invalid mint Account."
    },
    {
      "code": 6027,
      "name": "InvalidTreasuryAccount",
      "msg": "Invalid treasury Account for this market."
    },
    {
      "code": 6028,
      "name": "WithdrawalsLocked",
      "msg": "Not yet possible to withdraw funds."
    }
  ]
};

export const IDL: Credix = {
  "version": "0.1.0",
  "name": "credix",
  "instructions": [
    {
      "name": "initializeMarket",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatekeeperNetwork",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signingAuthorityBump",
          "type": "u8"
        },
        {
          "name": "globalMarketStateBump",
          "type": "u8"
        },
        {
          "name": "globalMarketSeed",
          "type": "string"
        },
        {
          "name": "interestFee",
          "type": {
            "defined": "Ratio"
          }
        },
        {
          "name": "withdrawalFee",
          "type": {
            "defined": "Ratio"
          }
        }
      ]
    },
    {
      "name": "depositFunds",
      "accounts": [
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createDeal",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "borrowerInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "deal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "dealBump",
          "type": "u8"
        },
        {
          "name": "borrowerInfoBump",
          "type": "u8"
        },
        {
          "name": "principal",
          "type": "u64"
        },
        {
          "name": "financingFeePercentage",
          "type": {
            "defined": "Ratio"
          }
        },
        {
          "name": "leverageRatio",
          "type": "u8"
        },
        {
          "name": "underwriterPerformanceFeePercentage",
          "type": {
            "defined": "Ratio"
          }
        },
        {
          "name": "timeToMaturityDays",
          "type": "u16"
        },
        {
          "name": "dealName",
          "type": "string"
        }
      ]
    },
    {
      "name": "activateDeal",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "deal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "makeDealRepayment",
      "accounts": [
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "repaymentType",
          "type": {
            "defined": "DealRepaymentType"
          }
        }
      ]
    },
    {
      "name": "withdrawFunds",
      "accounts": [
        {
          "name": "investor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "baseWithdrawalAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "passBump",
          "type": "u8"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        },
        {
          "name": "releaseTimestamp",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        },
        {
          "name": "releaseTimestamp",
          "type": "i64"
        }
      ]
    },
    {
      "name": "freezeGlobalMarketState",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "thawGlobalMarketState",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "borrowerInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numOfDeals",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "deal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "borrower",
            "type": "publicKey"
          },
          {
            "name": "principal",
            "type": "u64"
          },
          {
            "name": "financingFeePercentage",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "principalAmountRepaid",
            "type": "u64"
          },
          {
            "name": "interestAmountRepaid",
            "type": "u64"
          },
          {
            "name": "timeToMaturityDays",
            "type": "u16"
          },
          {
            "name": "goLiveAt",
            "type": "i64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "leverageRatio",
            "type": "u8"
          },
          {
            "name": "underwriterPerformanceFeePercentage",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "dealNumber",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lateFees",
            "type": "u64"
          },
          {
            "name": "lateFeesRepaid",
            "type": "u64"
          },
          {
            "name": "private",
            "type": "bool"
          },
          {
            "name": "defaulted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "globalMarketState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gatekeeperNetwork",
            "type": "publicKey"
          },
          {
            "name": "liquidityPoolTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "lpTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "totalOutstandingCredit",
            "type": "u64"
          },
          {
            "name": "treasuryPoolTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "signingAuthorityBump",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "interestFee",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "withdrawalFee",
            "type": {
              "defined": "Ratio"
            }
          },
          {
            "name": "frozen",
            "type": "bool"
          },
          {
            "name": "seed",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "credixPass",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isBorrower",
            "type": "bool"
          },
          {
            "name": "isUnderwriter",
            "type": "bool"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "releaseTimestamp",
            "type": "i64"
          },
          {
            "name": "user",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Ratio",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numerator",
            "type": "u32"
          },
          {
            "name": "denominator",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "DealRepaymentType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Interest"
          },
          {
            "name": "Principal"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DealCreationEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DealActivationEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalOutstandingCredit",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DealInterestRepaymentEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpTokenPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DealPrincipalRepaymentEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalOutstandingCredit",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "investor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "investorLpTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpTokenSupply",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "DepositEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        },
        {
          "name": "investor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "baseAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPoolAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "investorLpTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpTokenSupply",
          "type": "u64",
          "index": false
        },
        {
          "name": "globalMarketState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "globalMarketStateSeed",
          "type": "string",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPrincipalAmount",
      "msg": "This amount is not sufficient as a principal amount."
    },
    {
      "code": 6001,
      "name": "InvalidInterestAmount",
      "msg": "This amount is not sufficient as an interest amount."
    },
    {
      "code": 6002,
      "name": "DealNotLive",
      "msg": "This deal is not live yet."
    },
    {
      "code": 6003,
      "name": "InvalidDealRepaymentType",
      "msg": "Invalid deal repayment type."
    },
    {
      "code": 6004,
      "name": "NotEnoughLiquidity",
      "msg": "Not enough liquidity."
    },
    {
      "code": 6005,
      "name": "PrincipalRepaid",
      "msg": "Principal is already repaid."
    },
    {
      "code": 6006,
      "name": "InterestRepaid",
      "msg": "Interest is already repaid."
    },
    {
      "code": 6007,
      "name": "UnauthorizedSigner",
      "msg": "The Signer is not authorized to use this instruction."
    },
    {
      "code": 6008,
      "name": "CredixPassInvalid",
      "msg": "Credix pass is invalid for this request."
    },
    {
      "code": 6009,
      "name": "CredixPassInactive",
      "msg": "Credix pass is inactive at the moment."
    },
    {
      "code": 6010,
      "name": "Overflow",
      "msg": "Overflow occured."
    },
    {
      "code": 6011,
      "name": "Underflow",
      "msg": "Underflow occured."
    },
    {
      "code": 6012,
      "name": "ZeroDivision",
      "msg": "Tried to divide by zero."
    },
    {
      "code": 6013,
      "name": "ZeroDenominator",
      "msg": "Invalid Ratio: denominator can't be zero."
    },
    {
      "code": 6014,
      "name": "InvalidPreciseNumber",
      "msg": "Invalid u64 used as value for PreciseNumber."
    },
    {
      "code": 6015,
      "name": "PreciseNumberCastFailed",
      "msg": "Unable to cast PreciseNumber to u64"
    },
    {
      "code": 6016,
      "name": "NotEnoughLPTokens",
      "msg": "Not enough LP tokens."
    },
    {
      "code": 6017,
      "name": "NotEnoughBaseTokens",
      "msg": "Not enough Base tokens."
    },
    {
      "code": 6018,
      "name": "InterestBeforePrincipal",
      "msg": "Repay interest before principal."
    },
    {
      "code": 6019,
      "name": "MarketIsFrozen",
      "msg": "This market is currently frozen. Please try again later."
    },
    {
      "code": 6020,
      "name": "InvalidBorrowerTokenAccount",
      "msg": "Invalid Borrower Token Account."
    },
    {
      "code": 6021,
      "name": "InvalidBorrowerAccount",
      "msg": "Invalid Borrower Account."
    },
    {
      "code": 6022,
      "name": "InvalidGatewayToken",
      "msg": "Invalid Gateway token."
    },
    {
      "code": 6023,
      "name": "DealAlreadyActive",
      "msg": "Deal is already active."
    },
    {
      "code": 6024,
      "name": "InvalidInvestorTokenAccount",
      "msg": "Invalid Investor Token Account."
    },
    {
      "code": 6025,
      "name": "InvalidTokenAccountMint",
      "msg": "Invalid mint for Token Account."
    },
    {
      "code": 6026,
      "name": "InvalidMintAccount",
      "msg": "Invalid mint Account."
    },
    {
      "code": 6027,
      "name": "InvalidTreasuryAccount",
      "msg": "Invalid treasury Account for this market."
    },
    {
      "code": 6028,
      "name": "WithdrawalsLocked",
      "msg": "Not yet possible to withdraw funds."
    }
  ]
};
