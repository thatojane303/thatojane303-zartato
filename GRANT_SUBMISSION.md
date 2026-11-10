# Base grant readiness — ZarTATO

**Status:** internal draft, not submitted. **Last checked:** 2026-11-09.

This document is a candid readiness assessment, not an application or an eligibility promise. Base's public builder guidance describes grants as selective, up to $5,000, lists new asset creation among the possible tracks, and says integrating a Builder Code is the first step toward grant eligibility. Check the live program page and form again before applying:

- Program and current application link: https://docs.base.org/get-started/builders
- Builder Code overview: https://docs.base.org/specifications/builder-codes/overview

## Current assessment

ZarTATO is **not ready to submit**. The repository contains a simple fixed-supply token and tests, but not a live product that gives users a reason to transact on Base.

| Evidence item | Current state |
| --- | --- |
| Project code | Fixed-supply ERC-20 and a 17-test Hardhat suite are in this repository |
| Public demo | No working demo verified; the previously configured Vercel URL returned 404 on 2026-11-09 |
| Base contract | No deployed address is recorded; Base deployment files contain zero-address placeholders |
| Builder Code | No Builder Code or attributed transaction is recorded here; verify registration in Base Dashboard |
| Real market data | Not implemented; Thandi currently emits example-only mock data |
| Users and usage | No verified product-usage metrics are included in this repository |
| Security review | Not completed |
| Liquidity, reserves, or vesting | Not implemented; do not describe the token as backed, locked, or vested |

A grant reviewer may view “new asset creation” as a possible track, but a token contract by itself is a weak product case. Confirm the track and exact evidence required in the current application form.

## Honest application narrative to revisit after shipping

ZarTATO is an educational fixed-supply ERC-20 experiment rooted in South African potato-market culture. The current repository is pre-launch: it contains the token contract and tests, but no live product, Base deployment, live potato-price feed, Builder Code attribution, or verified usage metrics. The next milestone is a public market-learning experience with clearly sourced data and a useful onchain flow, followed by Builder Code attribution, a verified Base Sepolia deployment, and a small Gauteng user pilot. ZRT has no commodity backing, price peg, yield, or redemption promise.

Do not submit this paragraph as a claim that those future milestones already exist. Replace the prospective statements with demonstrated links and measurements only after they are real.

## Suggested readiness sequence

1. Build and publish a usable public product; replace the broken demo URL.
2. Decide what user action genuinely benefits from being on Base. Do not add a token transfer only to manufacture activity.
3. Register a Builder Code in Base Dashboard and integrate it into the product's Base transactions. Verify attribution with a real transaction.
4. Deploy the current contract to Base Sepolia, verify the source on BaseScan, and update the deployment record from a real transaction.
5. Complete an independent review and clarify who controls the initial supply before considering mainnet.
6. Run a small user pilot and report only measured users, retained usage, and transaction activity.
7. Re-check the current grant form, program track, and allowed spend before submission.

## Draft use of funds

Planning estimate only; not a quote, approved budget, or commitment. Revisit it with real quotes and the current program terms.

| Work | Draft amount | Outcome |
| --- | ---: | --- |
| Public product and data-source integration | $2,000 | A working experience using documented, non-mock data |
| Independent contract review | $1,500 | Written findings and remediation before mainnet |
| Gauteng pilot and user feedback | $1,000 | A documented small-group test, not a token sale |
| Hosting, testnet operations, and analytics | $500 | A stable demo and measurable attribution |
| **Total** | **$5,000** | Subject to the current program limits and approval |

## Application guardrails

- Do not submit a zero address, someone else's contract, simulated usage, or a dead demo link.
- Do not claim reserves, a peg, an oracle, a liquidity lock, vesting, a completed audit, or grant approval; none is implemented or verified here.
- This packet does not submit a form, request funds, or authorize a deployment.
