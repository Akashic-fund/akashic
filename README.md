<div align="center">
  <img src="public/akashic-logo.png" alt="Akashic Logo" />
</div>

# 🌍 Akashic

**Akashic** is an open-source platform that helps displaced communities preserve their cultural heritage and fund creative work using Web3 technologies. Refugee creators can upload stories, art, and multimedia—then launch funding campaigns powered by NFTs and smart contracts.

By leveraging decentralized storage (IPFS/Filecoin) and transparent, community-driven funding protocols, Akashic ensures these cultural narratives are owned by the people who create them—and remain accessible across borders and generations.

> Refugees are not just survivors—they are custodians of culture.

## Prerequisites

- [pnpm](https://pnpm.io/) (locked in as the package manager)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for local development only)

## Quick Start (Local Development)

1. **Clone and Install Dependencies:**

   ```bash
   git clone <repository-url>
   cd akashic
   pnpm install
   ```

2. **Set Up Environment Variables:**

   ```bash
   cp env.template .env.local
   ```

   Edit `.env.local` and populate the required variables. Refer to `env.template` for all available options and their descriptions.

3. **Start Development Environment:**

   ```bash
   docker compose up
   ```

   This will start:

   - PostgreSQL database
   - Next.js development server (accessible at [http://localhost:3000](http://localhost:3000))

4. **Initialize Database (in a new terminal):**

   ```bash
   docker compose exec app pnpm prisma migrate dev
   docker compose exec app pnpm prisma db seed
   ```

5. **Setup Development Wallet**

Create a browser profile and install a Wallet like metamask

visit https://faucet.celo.org/alfajores and add the testnet
copy your account-address into the form and claim CELO

## Enhanced Development Setup

In order to efficently and securely develop akashic, there is a app-shell
available that uses the same environment as the next-application. While it is
possible to do things pnpm install in the host and execute some scripts (eg pnpm
prisma db migrate) directly from the host (`docker compose exec app COMMAND`) it
is often more consistent to completely enter a development-environment that
matches the later production environment as closely as possible while still in
full control without installing all the required tools for the project in the
host (which often results in conflicts with other projects).

To enable the developer to do so, the docker compose file is providing both a
`app`-service and a `app-shell`-service. The developer will enter the cloned
directory and execute `docker compose up` as the documentation mentions before
and the result is that only the app is started in develop-mode (with
hot-reloading enabled).

### Environment Setup

For the docker environment it is possible to configure various details. This is
strictly not required as the docker compose file contains defaults. All of the
variables displayed here are optional

```bash
touch .env
# postgres configuration, the defaults are fine, the postgres is only reachable by the app
echo "POSTGRES_USER=somebody" >> .env
echo "POSTGRES_PASSWORD=somepassword" >> .env
echo "POSTGRES_DB=somedatabasename" >> .env
# postgres admin configuration: a web-based tool to query the database
echo "PGADMIN_DEFAULT_EMAIL=some@email.com" >> .env
echo "PGADMIN_DEFAULT_PASSWORD=someotherpassword" >> .env
echo "PGADMIN_PORT=1235" >> .env
# app configuration: change the default port 3000
echo "DEV_APP_PORT=1234" >> .env
```

### Development Container

In order to run commands, use the shell service: 

```bash
docker compose run --rm app-shell /bin/bash
```

This will start the required services (database,app) and
drop you in a shell that has the correct node version, pnpm et al installed. Its
a alpine-based minimal container with some development tools. You are root in
that container, you may install more software (`apk add`) which is gone once you
close the terminal. You may modify all files of the app (using the pnpm scripts
or your own cli-magic). In case you _create_ files, be aware that you are root,
this means the file wont be writeable to your host-user (eg your editor) until
you correct the ownership. `pnpm chown` fixes that up - a thing that happens
when prisma creates migrations for example. The develop container prompt is
prefixed with `aka-app` so you immediately see that you are not in your host.

### Development Database Management

Sometimes it is required to inquire the postgres database directly. If you
prefer a desktop-tool, just expose the port of the database-container to your
host, but ideally all you need is a browser. 

#### Prisma Studio (Database Browser)

Prisma Studio provides a visual interface to browse and edit your database data:

**Option 1: Direct Docker Exec**
```bash
docker compose exec app pnpm prisma studio --port 5555
```

**Option 2: Via App Shell**
```bash
docker compose run --rm app-shell pnpm prisma studio --port 5555
```

After starting Prisma Studio, navigate to [http://localhost:5555](http://localhost:5555) to access the database browser interface.

#### pgAdmin (Alternative Database Tool)

To start the pgadmin database tool,
run `docker compose --profile develop up -d`. after a few seconds navigate to
https://localhost:3001 (PGADMIN_PORT) and see a login, the default is
`admin@local.host` with the password `admin`. After you are signed in, connect
to a server host: `database`, username&password `akashic`. Now you can browse
the table schema, show and modify the data and execute queries.

## Database Setup Troubleshooting

If you encounter database-related issues, follow these steps:

1. **Generate Prisma Client:**

   ```bash
   docker compose exec app pnpm prisma generate
   ```

2. **Apply Migrations:**

   ```bash
   docker compose exec app pnpm prisma migrate deploy
   ```

3. **Seed Database:**
   ```bash
   docker compose exec app pnpm prisma db seed
   ```

Common issues and their solutions:

- **Missing Query Engine:** Update `binaryTargets` in `prisma/schema.prisma` and regenerate the client
- **Missing Tables:** Ensure migrations are applied before seeding
- **Seeding Failures:** Verify database is running and migrations are complete
- **Cross-Platform Development:** When developing across different platforms (e.g., Mac M1/M2 and Linux), ensure your `schema.prisma` includes all necessary binary targets:
  ```prisma
  binaryTargets = ["native", "rhel-openssl-3.0.x", "linux-arm64-openssl-3.0.x"]
  ```
- **Database Reset:** If you need to completely reset the database:
  ```bash
  docker compose down -v  # This removes all volumes
  docker compose up -d    # Start fresh
  docker compose exec app pnpm prisma generate  # Generate Prisma client
  docker compose exec app pnpm prisma migrate dev  # Reapply migrations
  docker compose exec app pnpm prisma db seed     # Reseed the database
  ```

## Database Logging Configuration

Control Prisma database logging verbosity with the `PRISMA_LOG_LEVELS` environment variable in `.env.local`.

**Available levels:** `error` (default), `warn`, `info`, `query`

**Example for development debugging:**
```bash
PRISMA_LOG_LEVELS=error,warn,query
```

> **Note:** The `query` level shows all SQL statements, useful for debugging but very verbose.

## Available Scripts

- `pnpm dev` - Start Next.js in development mode
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma ...` - Run Prisma CLI commands
- `pnpm prisma studio` - Launch Prisma Studio database browser (port 5555)

## Docker Commands (Development Only)

- `docker compose up` - Start development environment
- `docker compose down` - Stop and cleanup containers

> **Note:** Docker is used for development only. Production deployment uses Vercel.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [pnpm Documentation](https://pnpm.io/)

## Production Deployment

The application is deployed on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). For deployment details, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
