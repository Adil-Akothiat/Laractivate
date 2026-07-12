# 🛠️ Common Commands

### Stop Containers

```bash
docker-compose stop
```
### Start Containers

```bash
docker-compose start
```

### Restart Containers

```bash
docker-compose restart
```

### View Logs

```bash
docker-compose logs -f
```

### Restart Client

```bash
docker-compose restart client
```

### Reset Database

```bash
docker-compose exec app php artisan migrate:fresh --seed
```

### The "Bridge" Command: `docker-compose exec`

```bash
docker-compose exec [service_name] [command]
```

#### Example
- Client:
```bash
docker-compose exec client npm install <package-name>
```

- Server:
```bash
docker-compose exec app composer require <package-name>
```