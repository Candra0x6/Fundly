# Revenue-Sharing NFTs

## Overview

Revenue-Sharing NFTs are a key innovation of the ImpactInvest platform that allow MSMEs to tokenize future revenue streams. These NFTs implement the ICRC-7 standard with additional metadata and functionality to support revenue sharing.

## How Revenue-Sharing NFTs Work

1. **Creation**: Verified MSMEs can mint Revenue-Sharing NFTs that represent a percentage of their future revenue
2. **Percentage Definition**: Each NFT defines a specific revenue share percentage (in basis points, where 100 = 1%)
3. **Marketplace Listing**: NFTs are listed for sale at a price set by the MSME
4. **Investor Purchase**: Investors can purchase these NFTs using $FND tokens
5. **Revenue Distribution**: When MSMEs report revenue, a percentage is automatically distributed to NFT holders

## Technical Implementation

Revenue-Sharing NFTs extend the ICRC-7 standard with additional metadata:

```motoko
public type ICRC7TokenMetadata = {
    name : Text;
    description : Text;
    symbol : Text;
    royalties : Nat;
    image : Types.Document;
    price : Nat;
    // Additional custom fields for revenue share NFTs
    msmeId : Text;
    revenueShare : Nat; // Percentage of revenue in basis points (100 = 1%)
};
```

## Revenue Distribution Process

1. MSME reports revenue through the Revenue Reporting Canister
2. The system calculates the distribution amount for each NFT based on its revenue share percentage
3. For each NFT, the system:
   - Identifies the current owner
   - Calculates the amount to distribute
   - Transfers tokens from the MSME to the NFT owner
   - Records the distribution transaction

For a visual representation of this process, see the [Revenue-Sharing NFTs Flow Diagram](revenue-sharing-nfts-diagram.md).

## Benefits

### For MSMEs
- Alternative financing mechanism that doesn't create debt
- Ability to raise funds based on future revenue potential
- No fixed repayment schedule, payments only occur when revenue is generated

### For Investors
- Potential for regular income from MSME revenue
- Opportunity to directly support small businesses
- Ability to create a diversified portfolio of revenue-sharing investments

## Limitations and Considerations

- Revenue distribution depends on honest reporting by MSMEs
- Regulatory considerations around revenue-sharing investment
- Economic incentives for reporting accuracy and compliance

## Example

An MSME creates an NFT with a 5% revenue share (500 basis points) and lists it for 10,000 $FND tokens. An investor purchases this NFT. When the MSME reports monthly revenue of 20,000 $FND, the NFT holder automatically receives 1,000 $FND (5% of 20,000). 