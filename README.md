![dhaqsoPay Logo](.github/logo-light%20.png)

*Test payments effortlessly, build confidently.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)  
[![GitHub issues](https://img.shields.io/github/issues/dugsiiyeinc/dhaqsoPay)](https://github.com/dugsiiyeinc/dhaqsoPay/issues)  
[![GitHub stars](https://img.shields.io/github/stars/dugsiiyeinc/dhaqsoPay)](https://github.com/dugsiiyeinc/dhaqsoPay/stargazers)  
[![Closed Pull Requests](https://img.shields.io/github/issues-pr-closed/dugsiiyeinc/dhaqsoPay)](https://github.com/dugsiiyeinc/dhaqsoPay/issues?q=state%3Aclosed)
---

## Table of Contents

1. [Introduction](#introduction)   
2. [Problem Statement](#problem-statement)  
3. [Solution Statement](#solution-statement)  
4. [Project Overview](#project-overview)  
5. [Features](#features)  
6. [Installation](#installation)  
7. [Usage](#usage)  
8. [Team & Collaboration](#team--collaboration)  
   - [Dugsiiye Team](##dugsiiye--Team)  
   - [QuickPay Team & Contributors](##dhaqsoPay-team--contributors)  
9. [Lessons Learned](#lessons-learned)  
10. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)  
11. [License](#license)  
12. [Contact](#contact)  
13. [Acknowledgments](#acknowledgments)

---

## Introduction

**dhaqsoPay** is an open‐source payment testing solution designed to empower students and developers to simulate payment transactions without any financial risk. By providing a robust, sandboxed environment, the project allows users to test payment integrations and identify issues before integrating with live payment APIs.

---
## Problem Statement

Developers and students often face several challenges when testing payment integrations:

- **Risk:** Testing with live payment APIs can inadvertently trigger real transactions.
- **Complexity:** Building a realistic payment testing environment usually requires integrating multiple third-party services.
- **Limited Coverage:** Existing testing tools often fail to simulate every possible payment scenario.

---

## Solution Statement

**dhaqsoPay** was developed to address these issues by offering:

- **Mock Payment Endpoints:** Simulate a wide range of payment outcomes (successful transactions, failures, refunds).
- **Sandbox Environment:** A secure, isolated space for safely testing payment flows without any financial consequences.
- **Developer Tools:** Easily integrate the solution via a Browser Extension and NPM/PIP packages, streamlining the testing process.

---

## Project Overview

**dhaqsoPay** provides a comprehensive environment for simulating payment processes. Key aspects include:

- **API Simulation:** Emulate real-world payment scenarios in a controlled setting.
- **User-Friendly Tools:** Leverage a browser extension and integration packages for quick setup.
- **Detailed Reporting:** Access comprehensive logs and reports to monitor and debug payment flows.

For further details, please visit the [dhaqsoPay Repo](https://github.com/dugsiiyeinc/dhaqsoPay).

---

## Features

- **Payment Simulation API:**  
  Simulate various payment scenarios such as successful transactions, failures, and refunds.

- **Browser Extension:**  
  Test payment flows directly from your browser with an intuitive extension.

- **NPM/PIP Package Integration:**  
  Integrate **dhaqsoPay** effortlessly into Node.js or Python projects.

- **Sandbox Environment:**  
  Conduct tests in a safe, controlled environment without risking real funds.

- **Detailed Logging:**  
  Generate comprehensive logs and reports to analyze payment processes and troubleshoot issues.

---

## Installation

Clone the repository and install the necessary dependencies:

```bash
# Clone the repository
git clone https://github.com/dugsiiyeinc/dhaqsoPay.git
cd dhaqsoPay

# For Node.js projects
npm install

# For Python projects
pip install -r requirements.txt

```
---
## Usage
``` javascript

import { processPayment } from "dhaqsoPay";

const paymentDetails = {
  amount: 100,
  phone: "+25261XXXXXXX",
  method: "EVC",
};

processPayment(paymentDetails)
  .then((response) => console.log("Payment Successful", response))
  .catch((error) => console.error("Payment Failed", error));

```
---

## Team & Collaboration

### Dugsiiye Team

This project was initiated as part of a collaborative effort by a group of students passionate about software development.

### dhaqsoPay Team & Contributors

The following contributors played a key role in the success of **dhaqsoPay**:

- [Abdinasir Mursal](https://github.com/abdinasir-Tman) - **Fullstack Developer**
- [Faarax Abdullahi](https://github.com/faaraxcabdulaahi) - **Frontend Developer**
- [Iftin Awil](https://github.com/iftiiin) - **Frontend Developer**
- [Mohamed Abdirahim](https://github.com/hayle01) - **Frontend Developer**
- [Abdiqafar](https://github.com/apdyqafaar) - **Backend Developer**
- [Abdihakim Adan](https://github.com/shiinedev) - **Frontend Developer**
- [Nasro Muuse](https://github.com/Nasrah-muse) - **Frontend Developer**
- [Ayanle Osman](https://github.com/ducesane) - **Frontend Developer**
- [A-M-Ahmed](https://github.com/A-M-Ahmed) - **Frontend Developer**
- [View all contributors](https://github.com/dugsiiyeinc/dhaqsoPay/graphs/contributors)

---

## Lessons Learned

Throughout this project, the team learned:

- **Effective collaboration using GitHub Discussions.**
- **The importance of detailed API documentation.**
- **Real-world payment gateway challenges.**

---

## Frequently Asked Questions (FAQ)

### Is dhaqsoPay a real payment service?

No, it is a test environment for developers.

### Does dhaqsoPay store real payment data?

No, the system does not process or store any real payment data. All transactions are simulated for testing purposes only.

### Can I use dhaqsoPay in production environments?

No, dhaqsoPay is strictly for development and testing purposes. It is not intended for live payment processing.

### How can I integrate dhaqsoPay with my project?

You can use the NPM package, PIP package, or browser extension as described in the [Usage](#usage) section.

### What payment methods are supported in the simulation?

The simulation supports various mock payment methods such as EVC, Somnet, and Edahab.

### Can I simulate failed transactions?

Yes, you can configure mock responses to simulate failed transactions, refunds, and other scenarios

---

## Additional Resources

- [Project Documentation](https://github.com/dugsiiyeinc/dhaqsoPay/wiki)
- [API Reference](https://github.com/dugsiiyeinc/dhaqsoPay/api)
- [Getting Started Guide](https://github.com/dugsiiyeinc/dhaqsoPay/blob/main/docs/getting-started.md)

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## Contact

For any inquiries, reach out via [dugsiiye](https://github.com/dugsiiyeinc).

---

## Acknowledgments

Special thanks to everyone who contributed to this project!
