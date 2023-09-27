# BulletinBoard-Server

This Node.js server is built in TypeScript and serves as a bulletin board system. It combines information from three server calls and consolidates them into one object called "bulletin." You can use this server to retrieve bulletin information, add new bulletins, and delete existing bulletins. The server stores the information in a JSON file, checking if the file exists and reloading the data if necessary.

# Table of Contents
- Installation
- Usage
- Testing

# Installation
Before running the server, make sure you have Node.js and npm (Node Package Manager) installed on your system.

write this lines in your terminal:
```bash
git clone <repository-url>
cd bulletinBoard-Server
npm install
```

# Usage
To start the Node.js server, run the following command:
```bash
cd bulletinBoard-Server/src
ts-node index.ts
```

# Testing
This project includes tests to ensure its functionality. To run the tests, use the following command:
```bash
npm run test
```
 