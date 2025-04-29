# Fundly Platform Documentation

## Overview

Fundly is an NFT-based revenue sharing platform built on the Internet Computer Protocol (ICP) using Motoko. The platform enables MSMEs (Micro, Small, and Medium Enterprises) to raise funds by issuing revenue-sharing NFTs and distributing earnings to investors automatically.

## Table of Contents

- [System Architecture](architecture.md)
- [Canisters Overview](canisters/README.md)
  - [Token Canister](canisters/token.md)
  - [NFT Canister](canisters/nft.md)
  - [Authentication Canister](canisters/authentication.md)
  - [Asset Storage Canister](canisters/asset_storage.md)
  - [Revenue Reporting Canister](canisters/revenue_reporting.md)
  - [Verification Workflow Canister](canisters/verification_workflow.md)
- [Data Models](data-models.md)
- [Workflows](workflows.md)
  - [MSME Registration Flow](workflows.md#msme-registration-flow)
  - [NFT Issuance Flow](workflows.md#nft-issuance-flow)
  - [Revenue Reporting Flow](workflows.md#revenue-reporting-flow)
  - [Distribution Flow](workflows.md#distribution-flow)
- [Setup Guide](setup-guide.md)
- [Developer Guide](developer-guide.md)
- [API Reference](api-reference.md)

## Key Features

- **Revenue-sharing NFTs**: MSMEs can issue NFTs with defined revenue share percentages
- **Verification System**: MSME verification for enhanced trust and transparency
- **Token Economy**: $FND utility token for platform operations
- **Automated Distribution**: Automated revenue distribution to NFT holders
- **Asset Management**: Secure storage for MSME documents and NFT media

## Getting Started

For new developers, we recommend starting with these documentation pages:

1. [System Architecture](architecture.md) - Understand how the system is structured
2. [Setup Guide](setup-guide.md) - Set up your development environment
3. [Workflows](workflows.md) - Learn the key user and system flows
4. [Developer Guide](developer-guide.md) - Best practices for developing with Fundly
