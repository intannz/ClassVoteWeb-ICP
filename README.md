# Voting Web App - Internet Computer (ICP)

This is a decentralized web application built on the Internet Computer (ICP) using the DFINITY SDK and the Motoko programming language. It allows users to vote via a web interface connected to backend canisters deployed on the ICP.

## Project Description

The Voting Web App enables users to participate in online voting with decentralized, tamper-resistant data storage powered by canisters. It includes a simple frontend built with HTML, CSS, and JavaScript, which interacts with the backend through the DFINITY agent and actor model.

## Technologies Used

- DFINITY SDK (dfx) version 0.17
- Motoko (for backend canister logic)
- JavaScript (for frontend logic and interactivity)
- ICP Playground (for deployment and testing)
- HTML & CSS (for interface layout and styling)

## Deployment Limitations

### Cannot Deploy Locally

This project cannot be deployed locally due to limitations with the development machine:

- The local device (laptop) has hardware issues and cannot run `dfx start` reliably.
- As a result, local deployment (`dfx deploy`) fails or causes system instability.

### Cannot Deploy to ICP Network (Mainnet)

Deployment to the Internet Computer mainnet is also not supported because this project uses `dfx` version 0.17. This version does not fully support mainnet deployment features such as wallet creation or Internet Identity integration. Upgrading to a newer version of `dfx` would require significant code refactoring and is not part of the current development scope.

## Recommended Workflow via ICP Playground

As a workaround, this project should be deployed and tested using the ICP Playground, which provides a browser-based environment for running and previewing ICP canister-based applications.

### Deployment Steps via ICP Playground

1. Deploy the project to the ICP Playground by uploading the code or copying it into the Playground interface.

2. Run the first deployment using the "Deploy" button. After deployment, the Playground will generate a canister ID for the backend.

3. Copy the generated canister ID (e.g. `abcd1-sdfg2-aaaaa-aaaaa-cai`).

4. Open the `actor.js` file located in the frontend source directory and modify the canister ID manually. For example:

```javascript

export const canisterId = "xpjyl-daaaa-aaaab-qadcq-cai";
