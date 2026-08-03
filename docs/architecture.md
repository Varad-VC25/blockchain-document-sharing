# System Architecture Documentation

## Overview

This platform uses a hybrid architecture combining:
- Centralized: MongoDB (metadata), Node.js backend
- Decentralized: Ethereum blockchain (access control), IPFS (file storage)

## Upload Flow

User selects file
  -> Frontend validates file
  -> Backend encrypts with AES-256
  -> Generate SHA-256 hash
  -> Upload encrypted file to IPFS
  -> Receive CID from Pinata
  -> Store metadata in MongoDB
  -> Store metadata in Smart Contract
  -> Return success to user

## Download Flow

User requests document
  -> Verify JWT token (Backend)
  -> Check Smart Contract permission
  -> Fetch encrypted file from IPFS using CID
  -> Decrypt file with AES-256
  -> Verify SHA-256 hash matches
  -> Return original file to user

## Security Layers

| Layer | Technology    | Purpose                  |
|-------|--------------|--------------------------|
| 1     | AES-256      | File encryption          |
| 2     | SHA-256      | Integrity verification   |
| 3     | JWT          | API authentication       |
| 4     | Smart Contract| Permission management   |
| 5     | Helmet       | HTTP security headers    |
| 6     | Rate Limiting| DDoS protection          |
| 7     | Input Validation | Injection prevention |
