# k6 Load Testing Project

This repository contains k6 load testing scripts and tutorials for performance testing.

## Files Overview

- `load_test.js` - Main load testing script with staged load configuration
- `k6_tutorial.md` - Comprehensive k6 tutorial and documentation in Chinese

## Quick Start

### Prerequisites

Install k6 on your system:

**macOS:**
```bash
brew install k6
```

**Windows:**
```bash
winget install k6
```

**Linux:**
```bash
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Running the Load Test

Execute the main load test script:

```bash
k6 run load_test.js
```

### Test Configuration

The `load_test.js` script includes a staged load test that:

1. Ramps up to 100 users over 2 minutes
2. Maintains 100 users for 5 minutes
3. Ramps up to 200 users over 2 minutes
4. Maintains 200 users for 5 minutes
5. Ramps down to 0 users over 2 minutes

The test targets `https://httpbin.org/get` by default. Modify the URL in the script to test your own endpoints.

### Customization

To test your own API:
1. Replace the target URL in `load_test.js`
2. Modify the load stages in the `options.stages` array as needed
3. Adjust the checks for your specific response requirements

## Documentation

Refer to `k6_tutorial.md` for comprehensive documentation covering:
- k6 installation and setup
- Basic and advanced usage patterns
- Command-line options
- Result interpretation
- Performance testing best practices

## Resources

- [k6 Official Documentation](https://k6.io/docs/)
- [k6 JavaScript API](https://k6.io/docs/javascript-api/)
- [k6 Community Forum](https://community.k6.io/)