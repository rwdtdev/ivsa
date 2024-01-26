## ASVI service

### Description

### Requirements

- NextJs >= 14.x.x
- NodeJs >= 24.x.x

### Development setup

Easiest way to get started is to use [NIX package manager](https://nixos.org/download).
It can be used on Linux, WSL and MacOS.
To install nix package manager run:

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
```

After installation is complete, enable experimental features (nix flakes and nix command):

Add the following to ~/.config/nix/nix.conf or /etc/nix/nix.conf:

```bash
experimental-features = nix-command flakes
```

Now you are ready to initialize development environment:

```bash
nix develop .
```

Install dependencies:

```bash
npm install
```

Copy .env file:

```bash
cp .env.sample .env
```

Initialize database:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

Run development server:

```bash
npm run dev
```

### Tests

```bash
➜ npm run test
```
