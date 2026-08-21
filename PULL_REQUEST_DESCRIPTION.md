# Add Foundry tests, Echidna harness, and README quickstart

This PR adds Foundry-native tests, an Echidna harness for fuzzing, a Paymaster/EIP-7702 demo stack, and a Quickstart section for Foundry + Account Abstraction in the README.

What's included:
- contracts/ZarTATO.sol — ERC20 contract with CAP and reserve management (Foundry-ready)
- src/paymaster/ZartatoPaymaster.sol — ERC-4337 Paymaster that accepts ZRT
- src/accounts/ZartatoEIP7702Account.sol — simple account compatible with EIP-7702 demo
- src/oracle/MedianOracle.sol — simplified oracle used by the Paymaster
- test/ZarTATO.t.sol — Foundry unit tests for ZarTATO
- test/ZartatoPaymaster.t.sol — Foundry test for Paymaster
- fuzz/EchidnaZarTATO.sol — Echidna harness + invariants
- script/DeployOnBNB.s.sol — Foundry script to deploy demo stack on BNB
- certora/specs/*.spec — Certora-style specs included for reference
- README.md — Quickstart section for Foundry + AA added to the top
- foundry.toml — Foundry config
- .github/workflows/ci.yml — CI workflow to run forge tests and Echidna Docker job

How to run:
- forge build && forge test
- docker run --rm -v $(pwd):/src -w /src trailofbits/echidna echidna-test fuzz/EchidnaZarTATO.sol --contract EchidnaZarTATO --timeout 60

Notes:
- The CI runs Echidna inside Docker (trailofbits/echidna). This can be disabled on request.
- Ensure lib dependencies are installed (forge install).