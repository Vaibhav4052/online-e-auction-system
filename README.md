# 🔐 Secure Online E-Auction System Using Blockchain Technology

A secure, transparent, and tamper-proof **web-based E-Auction platform** built using **Blockchain Technology** to ensure trust and fairness in online auctions.  
This system integrates **Django-based web architecture** with **Ethereum smart contracts** to prevent fraud, manipulation, and unauthorized access.

---

## 📌 Project Overview

The **Secure Online E-Auction System** is designed to allow users to participate in online auctions for products listed from e-commerce platforms.  
By leveraging **Blockchain technology**, the application guarantees:

- Transparent bidding
- Immutable auction records
- Secure transactions
- Fraud prevention

The project implements **user authentication**, **smart contract-based bidding**, and a **secure auction workflow**.

---

## 🧰 Technologies Used

### Backend
- **Python**
- **Django Framework**
- **Django Authentication System**
- **SQLite Database**

### Frontend
- **HTML**
- **CSS**
- **Bootstrap**

### Blockchain
- **Solidity (Smart Contracts)**
- **Ethereum Blockchain (Test Network)**
- **Web3.py**

---

## ⚙️ Key Features

- 🔑 **User Registration & Authentication** (Django Auth)
- 👤 Secure Role-Based User Model
- 🛒 Product Listing for Auction
- ⏱️ Time-Bound Auction System
- 💰 Transparent Bidding Mechanism
- 🔗 Blockchain-Backed Bid Storage
- 📜 Immutable Auction Records
- 🔐 Prevention of Bid Tampering
- 📊 Auction Result Verification via Smart Contracts

---

## 🏗️ System Architecture

1. **Frontend Interface**
   - User interacts with auction listings and bidding forms.

2. **Django Backend**
   - Handles authentication, auction logic, and database operations.

3. **Blockchain Layer**
   - Smart contracts store bids and auction results securely.
   - Ensures immutability and transparency.

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Django
- Ganache / Ethereum Test Network
- Node.js & npm
- MetaMask Browser Extension

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/secure-e-auction-blockchain.git

# Navigate to project directory
cd secure-e-auction-blockchain

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver
