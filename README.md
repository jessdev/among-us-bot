# among-us-bot
[Invite Bot to Your Server](https://discord.com/api/oauth2/authorize?client_id=756652217825493053&permissions=67648&scope=bot)

# Running
use the command `npm run start` to build and run the typescript project.
Under the covers it runs:
```
npm run build
node dist/bot.js
```
# Build Docker Container
```
docker build . --tag <your-tag>
```

# Running Docker Container
```
docker run --env-file .\.env --mount type=bind,src=<path to data folder>,dst=/app/data <your-tag>
```

## Setting up Authentication
On windows - `$env:DISCORD_TOKEN = '<the token>'`

### Environment Variables

#### When running without docker

set

```
$env:DISCORD_TOKEN = <token>
$env:DATABASE = <database file path>
```

#### For docker

 create .env file with

```
DISCORD_TOKEN=<token>
DATABASE=<databasefile>
```
