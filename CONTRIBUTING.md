# Contributing to ZarTATO

Thank you for your interest in contributing to the ZarTATO project! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/thatojane303/thatojane303-zartato.git
   cd thatojane303-zartato
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name dev
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Development Workflow

### Branch Naming Convention
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `docs/*` - Documentation updates
- `release/*` - Release branches

### Commit Messages
Use conventional commits:
```
feat: add new feature
fix: resolve issue
docs: update documentation
test: add test cases
chore: maintenance tasks
```

### Testing
Before submitting a PR:
```bash
npm test
npx hardhat compile
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git pull origin dev
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a PR**
   - Target: `dev` branch
   - Use the PR template
   - Link related issues
   - Add descriptive title and description

4. **Code Review**
   - Address reviewer feedback
   - Update commits as needed
   - Ensure CI passes

## Code Standards

### Smart Contracts
- Use Solidity ^0.8.20
- Follow OpenZeppelin patterns
- Include NatSpec comments
- Write comprehensive tests

### JavaScript/Node.js
- Use async/await
- Include error handling
- Write descriptive variable names
- Comment complex logic

### Testing
- Unit tests for all functions
- Edge case coverage
- Integration tests for oracle
- Minimum 80% code coverage

## Feature Branches

Current feature branches:
- `feature/price-aggregation` - Multi-source price aggregation
- `feature/reserve-auditing` - Reserve tracking and auditing
- `feature/multi-market-integration` - Additional market sources
- `feature/governance` - DAO governance mechanisms
- `release/v1.0.0` - Version 1.0.0 release

## Testing Your Changes

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deployAndRequest.js --network bsctestnet
```

## Questions or Need Help?

Open an issue on GitHub with:
- Clear title
- Detailed description
- Steps to reproduce (for bugs)
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
