# Fundly: Decentralized Funding for MSMEs

[![Motoko](https://img.shields.io/badge/Language-Motoko-orange.svg)](https://sdk.dfinity.org/docs/language-guide/motoko.html)
[![DFINITY](https://img.shields.io/badge/Platform-DFINITY-purple.svg)](https://dfinity.org/)

Welcome to **Fundly**, a revolutionary platform built on the Internet Computer (ICP) that empowers Micro, Small, and Medium Enterprises (MSMEs) by connecting them with investors through innovative blockchain technology. Our mission is to democratize access to funding and foster economic growth by leveraging the power of decentralized finance (DeFi).

Fundly introduces a unique model of revenue-sharing NFTs, allowing MSMEs to tokenize future revenue streams and offer them to investors as a form of non-debt financing. This project matters because it addresses the critical funding gap faced by MSMEs worldwide, providing a transparent, secure, and efficient funding mechanism.

## 🌟 Key Features

- **Revenue-Sharing NFTs**: MSMEs can mint NFTs representing a percentage of future revenue, enabling investors to earn returns based on business performance.
- **MSME Verification**: A robust verification workflow ensures trust by validating business legitimacy through document submission and review.
- **Revenue Reporting**: Secure and transparent reporting of revenue data for accurate distribution to NFT holders.
- **Decentralized Architecture**: Built on the Internet Computer using Motoko, ensuring scalability, security, and decentralization.
- **User-Friendly Interface**: Accessible platform for both MSMEs and investors to interact with canisters and manage assets.

## 🚀 Technologies Used

- **Motoko**: The programming language optimized for the Internet Computer, used to develop our smart contracts (canisters).
- **DFINITY Internet Computer (ICP)**: The blockchain platform hosting our decentralized application, providing scalability and low-cost transactions.
- **Canisters**: Smart contracts on ICP that manage MSME registration, verification, revenue reporting, asset storage, and NFT functionality.
- **ICRC-7 Standard**: Extended for our revenue-sharing NFTs to include custom metadata like revenue share percentages.

## 📚 Documentation

Dive deeper into Fundly with our comprehensive documentation:
- [Architecture Overview](./docs/architecture.md)
- [Canister API Reference](./docs/canister-api.md)
- [MSME Verification Process](./docs/concepts/msme-verification.md)
- [Revenue-Sharing NFTs Explained](./docs/concepts/revenue-sharing-nfts.md)
- [Revenue Reporting Guide](./docs/tutorials/revenue-reporting-guide.md)
- [Canister Documentation](./docs/canisters/)

## 🛠️ Getting Started

Follow these beginner-friendly instructions to set up, run, and deploy Fundly locally or on the Internet Computer.

### Prerequisites
- **DFX SDK**: Install the DFINITY Canister SDK by following the [official guide](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html).
- **Node.js**: Required for frontend development (if applicable).
- **Git**: To clone the repository.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/candra0x6/fundly.git
   cd fundly
   ```
2. Install dependencies (if a frontend is included):
   ```bash
   npm install
   ```

### Running Locally
1. Start the local Internet Computer replica:
   ```bash
   dfx start --background
   ```
2. Deploy the canisters locally:
   ```bash
   dfx deploy
   ```
3. Access the platform through the local URL provided by `dfx` (typically `http://localhost:8000/?canisterId=<your-canister-id>`).

### Deploying to ICP
1. Ensure you have cycles in your wallet to pay for deployment:
   - Convert ICP to cycles using the DFINITY dashboard or CLI.
2. Deploy to the mainnet:
   ```bash
   dfx deploy --network ic
   ```
3. Access your deployed application via the canister URL on the Internet Computer.

---
Built with ❤️ on the Internet Computer by the Fundly Team
