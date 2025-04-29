# Setup Guide

This guide will help you set up your development environment to work with the Fundly platform.

## Prerequisites

Before starting, make sure you have the following installed:

- **DFINITY Canister SDK (DFX)** - Version 0.12.0 or higher
  - [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- **Node.js** - Version 16 or higher
  - [Download Node.js](https://nodejs.org/)
- **Git** - For version control
  - [Download Git](https://git-scm.com/downloads)

### Windows Users

DFX is not natively supported on Windows. You have two options:

1. **Windows Subsystem for Linux (WSL2)** - Recommended

   - [Install WSL2](https://docs.microsoft.com/en-us/windows/wsl/install)
   - Install DFX within your Linux environment

2. **Docker** - Alternative option
   - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Use the DFINITY SDK Docker image

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/fundly.git
cd fundly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Local Internet Computer Replica

```bash
dfx start --background
```

This starts a local Internet Computer environment where you can deploy and test your canisters.

### 4. Deploy Canisters to Local Replica

```bash
dfx deploy
```

This command:

- Compiles all canisters
- Creates canister instances on the local replica
- Installs the compiled code
- Generates interfaces for interacting with the canisters

## Canister Setup

After deploying, you'll need to initialize some canisters and establish their connections:

### 1. Initialize the Token Canister

```bash
dfx canister call token_canister initialize
```

This sets up the initial token supply for the $FND token.

### 2. Configure Canister References

Update the canister IDs in each canister to reference the other deployed canisters:

```bash
# Example: Update canister references in the revenue reporting canister
dfx canister call revenue_reporting updateCanisterReferences \
  "(\"$(dfx canister id msme_registration)\", \
    \"$(dfx canister id nft_canister)\", \
    \"$(dfx canister id token_canister)\")"
```

Similar commands need to be run for other canisters that reference each other.

### 3. Set Up Admin User

```bash
# Create initial admin user
dfx canister call authentication setAdminPrincipal "(principal \"$(dfx identity get-principal)\")"
```

This sets your current dfx identity as the admin for the platform.

## Development Workflow

### Running the Frontend

Once the backend canisters are deployed, you can run the frontend:

```bash
npm start
```

This starts a local development server for the frontend, typically on http://localhost:8080.

### Interacting with Canisters via CLI

You can interact with deployed canisters directly using the `dfx canister call` command:

```bash
# Example: Check token name
dfx canister call token_canister icrc1_name

# Example: Get all MSMEs
dfx canister call msme_registration getAllMSMEs
```

### Canister Development Cycle

When making changes to canister code:

1. Edit the Motoko files
2. Redeploy the specific canister:
   ```bash
   dfx deploy <canister_name>
   ```
3. Test your changes

## Testing

### Running Unit Tests

To run unit tests for the canisters:

```bash
npm test
```

### Integration Testing

For integration tests that span multiple canisters:

```bash
npm run test:integration
```

## Troubleshooting

### Common Issues

#### 1. Failed to Start DFX

If you get an error like `Failed to start dfx`, try:

```bash
# Check if any dfx processes are already running
ps aux | grep dfx
# Kill any running dfx processes
pkill dfx
# Try starting again
dfx start --clean --background
```

#### 2. Canister Deployment Failures

If canister deployment fails:

```bash
# Check the replica status
dfx ping
# Get more verbose output
dfx deploy --verbose <canister_name>
```

#### 3. Connectivity Issues Between Canisters

If canisters can't communicate:

```bash
# Verify canister IDs
dfx canister id <canister_name>
# Update canister references with correct IDs
```

## Next Steps

After setup, you might want to:

1. Explore the [API Reference](api-reference.md) to understand available functions
2. Review the [Workflows](workflows.md) documentation to understand how system components interact
3. Start creating test MSMEs and NFTs to explore the system functionality

## Deploying to the IC Mainnet

For mainnet deployment:

1. Create a cycles wallet

   ```bash
   dfx identity get-principal
   # Use this principal to get a cycles wallet from faucet
   ```

2. Add your cycles wallet

   ```bash
   dfx identity set-wallet <wallet-canister-id>
   ```

3. Deploy to mainnet

   ```bash
   dfx deploy --network ic
   ```

4. Configure canister references on mainnet as shown in the Canister Setup section, but using the `--network ic` flag.
