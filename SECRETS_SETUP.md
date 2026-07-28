# GitHub Actions Secrets Setup Guide

## Required Secrets for ZarTATO GitHub Actions Workflow

This guide will help you configure the GitHub Actions secrets needed for automated price updates.

## Step 1: Navigate to Repository Settings

1. Go to your repository: https://github.com/thatojane303/thatojane303-zartato
2. Click **Settings** (top navigation bar)
3. In the left sidebar, click **Secrets and variables** → **Actions**

## Step 2: Create the Required Secrets

### Secret 1: PRIVATE_KEY
- **Name:** `PRIVATE_KEY`
- **Value:** Your BSC Testnet wallet private key (starts with `0x`)
  ```
  0x...your_bsc_testnet_private_key_here...
  ```
- Click **Add secret**

### Secret 2: ORACLE_ADDR
- **Name:** `ORACLE_ADDR`
- **Value:** Your deployed ZarTATOOracle contract address
  ```
  0x...your_deployed_oracle_address...
  ```
- Click **Add secret**

### Secret 3: SUB_ID
- **Name:** `SUB_ID`
- **Value:** Your Chainlink Functions subscription ID (integer)
  ```
  12345
  ```
- Click **Add secret**

## Step 3: Verify Secrets

You should now see three secrets listed:
- ✅ `PRIVATE_KEY`
- ✅ `ORACLE_ADDR`
- ✅ `SUB_ID`

## Step 4: Test the Workflow

1. Go to **Actions** tab
2. Select **Daily ZRT Price Update** workflow
3. Click **Run workflow** → **Run workflow** button
4. Check logs to verify execution

## Workflow Details

**Location:** `.github/workflows/daily-price.yml`

**Schedule:** 
- Daily at 10:00 UTC (10:00 SAST)
- Monday through Friday

**What it does:**
1. Reads your wallet private key from `PRIVATE_KEY` secret
2. Calls your deployed oracle at `ORACLE_ADDR`
3. Uses subscription ID `SUB_ID` to request price updates
4. Fetches live potato prices from SA markets
5. Updates the on-chain price feed

## Security Best Practices

⚠️ **Important:**
- Never commit your private key to the repository
- Only store in GitHub Secrets
- Use a testnet wallet (not mainnet)
- Rotate keys periodically
- Never share your secrets or logs that might expose them

## Troubleshooting

### Error: "Invalid subscription ID"
- Verify `SUB_ID` matches your Chainlink Functions subscription
- Check that the subscription is funded with LINK tokens

### Error: "Insufficient funds"
- Ensure your wallet (from `PRIVATE_KEY`) has BNB for gas fees
- Check your Chainlink subscription has enough LINK tokens

### Workflow doesn't trigger
- Verify secrets are set correctly
- Check workflow is enabled in Actions tab
- Confirm schedule time in UTC

## What's Next?

After setting up secrets:
1. ✅ Verify workflow runs successfully
2. ✅ Monitor price updates on BSCScan
3. ✅ Check oracle price feed updates
4. ✅ Plan mainnet deployment

---

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)
