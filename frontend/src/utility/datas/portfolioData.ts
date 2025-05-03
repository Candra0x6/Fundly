import { MSME } from "@declarations/msme_registration/msme_registration.did";
import { NFT } from "@declarations/nft_canister/nft_canister.did";
import { Revenue, TransactionWithRevenue } from "@declarations/revenue_reporting/revenue_reporting.did";
import { Principal } from "@dfinity/principal";
export interface PortfolioInvestmentData {
  portfolio: {
    totalValue: string;
    totalInvested: string;
    totalGrowth: string;
    totalEarnings: string;
    activeInvestments: number;
    diversification: {
      industries: { name: string; percentage: number }[];
      countries: { name: string; percentage: number }[];
      returnRates: { name: string; percentage: number }[];
    };
  };
  statistics: {
    totalInvested: string;
    totalEarnings: string;
    activeInvestments: string;
    portfolioGrowth: string;
  };
  ownedNFTs: {
    id: string;
    title: string;
    company: string;
    image: string;
    invested: string;
    earnings: string;
    nextPayout: string;
    returnRate: string;
    industry: string;
    country: string;
    purchaseDate: string;
    status: string;
  }[];
  history: { id: string; nftTitle: string; company: string; amount: string; date: string; status: string }[];
}
type Entry = {
  nft: NFT;
  msmeData: MSME[];
};


function buildFullPortfolioData(
  userPrincipal: Principal,
  data: Entry[],
  revenues: TransactionWithRevenue[],
): PortfolioInvestmentData {

  console.log("data", data);

  // Debug the structure of the first entry to understand msmeData format
  if (data && data.length > 0) {
    const firstEntry = data[0];
    console.log("Sample Entry Structure:", {
      nftId: firstEntry?.nft?.id,
      hasMetadata: !!firstEntry?.nft?.metadata,
      hasMsmeData: !!firstEntry?.msmeData,
      msmeDataLength: firstEntry?.msmeData?.length || 0,
      msmeDataSample: firstEntry?.msmeData && firstEntry.msmeData.length > 0 ?
        {
          hasDetails: !!firstEntry.msmeData[0]?.details,
          detailsKeys: firstEntry.msmeData[0]?.details ? Object.keys(firstEntry.msmeData[0].details) : []
        } : 'No MSME data'
    });
    // The problem might be with this filter - let's check if entries have proper structure
    const userNFTs = data.filter(entry =>
      entry && entry.nft && entry.nft.owner &&
      typeof entry.nft.owner === 'object' &&
      'owner' in entry.nft.owner &&
      entry.nft.owner.owner.toString() === userPrincipal.toString()
    );

    console.log("userNFTs after filter:", data);

    // Make sure we're processing NFTs correctly
    const ownedNFTs = userNFTs.map(entry => {
      if (!entry || !entry.nft || !entry.nft.metadata) {
        console.error("Invalid NFT entry:", entry);
        return null;
      }

      try {
        // Safely extract metadata
        const msmeId = entry.nft.metadata.msmeId;
        console.log(entry)
        // Try to get company name from msmeData
        let company = entry.msmeData[0].details.name || "Unknown";
        try {
          if (entry.msmeData && Array.isArray(entry.msmeData) && entry.msmeData.length > 0 &&
            entry.msmeData[0].details && entry.msmeData[0].details.name) {
            company = entry.msmeData[0].details.name;
            console.log(`Found company name for NFT ${entry.nft.id}: ${company}`);
          } else {
            console.log(`No company name found for NFT ${entry.nft.id}, msmeData:`, entry.msmeData);
          }
        } catch (err) {
          console.error("Error extracting company name for owned NFT:", err);
        }

        // Safely process earnings
        const earningsTxs = revenues
          .filter(r => r.revenue && r.revenue.distributed && r.revenue.msmeId === msmeId)
          .flatMap(r => r.revenue.distributionTxs || [])
          .filter(tx => tx && tx.tokenId === entry.nft.id &&
            tx.recipient && tx.recipient.owner &&
            tx.recipient.owner.toString() === userPrincipal.toString());

        const earnings = earningsTxs.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

        // Next payout
        const futureRevs = revenues
          .filter(r => r.revenue && r.revenue.msmeId === msmeId &&
            Number(r.revenue.reportDate) > Date.now());

        const nextPayout = futureRevs.length > 0
          ? futureRevs.sort((a, b) => Number(a.revenue.reportDate) - Number(b.revenue.reportDate))[0]?.revenue.reportDate
          : null;

        const price = Number(entry.nft.metadata.price || 0);
        const revenueShare = Number(entry.nft.metadata.revenueShare || 0);
        const mintedAt = Number(entry.nft.minted_at || Date.now());

        return {
          id: String(entry.nft.id),
          title: entry.nft.metadata.name || "Unnamed NFT",
          company,
          image: entry.nft.metadata.image?.assetId || "",
          invested: `$${(price / 100).toLocaleString()}`,
          earnings: `$${(earnings / 100).toLocaleString()}`,
          nextPayout: nextPayout ? new Date(Number(nextPayout)).toLocaleDateString() : "TBD",
          returnRate: `${revenueShare / 100}%`,
          industry: "Unknown",
          country: "Unknown",
          purchaseDate: new Date(mintedAt).toLocaleDateString(),
          status: "active", // you can add logic for inactive if needed
        };
      } catch (error) {
        console.error("Error processing NFT:", error, entry);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from processing errors

    console.log("Processed ownedNFTs:", ownedNFTs);

    // Safely calculate stats
    const totalInvested = userNFTs.reduce((sum, entry) => {
      if (entry && entry.nft && entry.nft.metadata && entry.nft.metadata.price) {
        return sum + Number(entry.nft.metadata.price);
      }
      return sum;
    }, 0);

    const totalEarnings = ownedNFTs.reduce((sum, nft) => {
      if (nft && nft.earnings) {
        const cleaned = nft.earnings.replace(/[^\d.-]/g, "");
        return sum + (isNaN(parseInt(cleaned)) ? 0 : parseInt(cleaned));
      }
      return sum;
    }, 0);

    // Simulasi nilai saat ini
    const totalValue = totalInvested * 1.0625;

    // Diversifikasi
    const countBy = (arr: any[], key: string) => {
      if (!arr || arr.length === 0) return [];

      const count: Record<string, number> = {};
      arr.forEach(item => {
        if (!item) return;
        const k = item[key] || "Unknown";
        count[k] = (count[k] || 0) + 1;
      });
      return Object.entries(count).map(([name, countVal]) => ({
        name,
        percentage: Math.round((countVal / arr.length) * 100),
      }));
    };

    const returnRates = {
      "High (15%+)": (nft: any) => {
        if (!nft || !nft.returnRate) return false;
        const rate = parseFloat(nft.returnRate.replace(/[^\d.-]/g, ""));
        return !isNaN(rate) && rate >= 15;
      },
      "Medium (10-15%)": (nft: any) => {
        if (!nft || !nft.returnRate) return false;
        const rate = parseFloat(nft.returnRate.replace(/[^\d.-]/g, ""));
        return !isNaN(rate) && rate >= 10 && rate < 15;
      },
      "Low (5-10%)": (nft: any) => {
        if (!nft || !nft.returnRate) return false;
        const rate = parseFloat(nft.returnRate.replace(/[^\d.-]/g, ""));
        return !isNaN(rate) && rate < 10;
      },
    };

    const returnRateDistribution = Object.entries(returnRates).map(([label, filterFn]) => {
      const count = ownedNFTs.filter(filterFn).length;
      return {
        name: label,
        percentage: ownedNFTs.length > 0 ? Math.round((count / ownedNFTs.length) * 100) : 0,
      };
    });

    // Create a map for easy NFT lookup
    const nftMap = Object.fromEntries(
      data
        .filter(entry => entry && entry.nft && entry.nft.id)
        .map(entry => [String(entry.nft.id), entry])
    );

    const history = [];

    console.log("Processing revenues:", revenues.length);

    for (const revenue of revenues) {
      if (!revenue || !revenue.revenue) {
        console.log("Skipping invalid revenue entry");
        continue;
      }

      try {
        console.log(`Processing revenue for MSME ID: ${revenue.revenue.msmeId}, distributed: ${revenue.revenue.distributed}`);

        // Convert timestamp properly - some systems use milliseconds, others use seconds
        const timestamp = Number(revenue.revenue.reportDate);
        const reportDate = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
        const date = new Date(reportDate).toLocaleDateString();
        const status = revenue.revenue.distributed ? "received" : "upcoming";

        // Debug distribution transactions
        console.log(`Distribution transactions: ${(revenue.revenue.distributionTxs || []).length}`);

        // If there are no distribution transactions yet but the revenue entry exists
        if (!revenue.revenue.distributionTxs || revenue.revenue.distributionTxs.length === 0) {
          console.log("No distribution transactions found");

          // For upcoming revenues that haven't been distributed yet, we can still show them in history
          if (!revenue.revenue.distributed) {
            // Find all NFTs associated with this MSME
            const relatedNfts = userNFTs.filter(entry =>
              entry.nft && entry.nft.metadata && entry.nft.metadata.msmeId === revenue.revenue.msmeId
            );

            for (const nftEntry of relatedNfts) {
              // Add a placeholder entry for upcoming revenue
              history.push({
                id: `upcoming-${revenue.revenue.msmeId}-${revenue.revenue.reportDate}-${nftEntry.nft.id}`,
                nftTitle: nftEntry.nft.metadata.name || "Unnamed NFT",
                company: "Unknown",
                amount: "Pending",
                date,
                status: "upcoming",
              });
            }
          }
          continue;
        }

        for (const tx of revenue.revenue.distributionTxs) {
          console.log(`Processing transaction: TokenID ${tx.tokenId}, RecipientOwner: ${tx?.recipient?.owner?.toString()}`);

          if (!tx || !tx.recipient || !tx.recipient.owner) {
            console.log("Invalid transaction structure");
            continue;
          }

          // Compare principal strings
          const recipientOwner = tx.recipient.owner.toString();
          const userPrincipalStr = userPrincipal.toString();

          console.log(`Comparing: ${recipientOwner} vs ${userPrincipalStr}`);

          if (recipientOwner !== userPrincipalStr) {
            console.log("Transaction recipient doesn't match user principal");
            continue;
          }

          // Look up the NFT in our map
          const nft = nftMap[String(tx.tokenId)];
          console.log(`NFT lookup result for token ${tx.tokenId}:`, nft ? "Found" : "Not found");

          if (!nft || !nft.nft || !nft.nft.metadata) {
            console.log("No matching NFT found for this transaction");

            // Even if we don't have the NFT details, we can still show the transaction
            history.push({
              id: String(tx.txId ?? `${tx.tokenId}-${revenue.revenue.reportDate}`),
              nftTitle: `NFT #${tx.tokenId}`,
              company: "Unknown",
              amount: `${(Number(tx.amount || 0) / 100).toLocaleString()}`,
              date,
              status,
            });
            continue;
          }

          history.push({
            id: String(tx.txId ?? `${tx.tokenId}-${revenue.revenue.reportDate}`),
            nftTitle: nft.nft.metadata.name || "Unnamed NFT",
            company: "Unknown",
            amount: `${(Number(tx.amount || 0) / 100).toLocaleString()}`,
            date,
            status,
          });
        }
      } catch (error) {
        console.error("Error processing revenue:", error, revenue);
      }
    }

    console.log(`Processed ${history.length} history entries`);

    // Optional: sort by date descending
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const portfolio = {
      totalValue: `$${(totalValue / 100).toLocaleString()}`,
      totalInvested: `$${(totalInvested / 100).toLocaleString()}`,
      totalGrowth: "+6.25%", // placeholder
      totalEarnings: `$${(totalEarnings / 100).toLocaleString()}`,
      activeInvestments: ownedNFTs.length,
      diversification: {
        industries: countBy(ownedNFTs, "industry"),
        countries: countBy(ownedNFTs, "country"),
        returnRates: returnRateDistribution,
      },
    };

    const statistics = {
      totalInvested: `$${(totalInvested / 100).toLocaleString()}`,
      totalEarnings: `$${(totalEarnings / 100).toLocaleString()}`,
      activeInvestments: String(userNFTs.length),
      portfolioGrowth: "+12.4%", // Placeholder
    };

    return { portfolio, statistics, ownedNFTs, history };
  }
}

export default buildFullPortfolioData;