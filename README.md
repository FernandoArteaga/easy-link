<div align="center" style="text-align: center;">
    <img src="static/favicon.png" height="128" width="128"  alt="Repo logo"/>
    <h1>
        <a href="https://the-easy-link.web.app/links" target="_blank">The Easy Link</a>
    </h1>
    <h2>Effortlessly save and access your copied links across all your devices.</h2>
</div>

Built with love, using:

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

# Features

- Easy to use interface
- Save links to the cloud
- Access your links from any device
- Secure authentication

# Development

## Setup

We use [pnpm](https://pnpm.io/) as our package manager. To install the dependencies, run:

```bash
pnpm install
```

## Serve

To run the development server, use the following command:

```bash
pnpm dev
```

## Firebase

We use Firebase for our backend services. To use Firebase, you need to create a Firebase project and add the Firebase
configuration to the `.env` file.

For local development, you can use the Firebase emulators. See the [Emulators](#emulators) section for more information.

Services used:

- Firestore
- Firebase Authentication
- Firebase Hosting

### Emulators

To run the Firebase emulators, use the following command:

```bash
pnpm firebase-emulator:start
```
