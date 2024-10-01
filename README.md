## ASVI

[![pipeline status](https://rwdt1.gitlab.yandexcloud.net/rwdt/services/asvi/badges/main/pipeline.svg)](https://rwdt1.gitlab.yandexcloud.net/rwdt/services/asvi/-/commits/main)
[![version](https://rwdt1.gitlab.yandexcloud.net/rwdt/services/asvi/-/badges/release.svg)](https://rwdt1.gitlab.yandexcloud.net/rwdt/services/asvi/-/releases)

Сервис автоматизации видеинвентаризаций с приминением программного обеспечения IVA R (АС
ВИ)

- [Спецификация Openapi-3.0](./docs/openapi.yaml)
- [Публичная спецификация Openapi-3.0](./docs/openapi-public.yaml)
- [Публичная спецификация IVA R](./docs/openapi-iva.yaml)

### Компоненты и их версии

- Next.js >= 14.x.x
- Node.js >= 24.x.x

### Сборка продуктовой версии

```bash
# Сборка
➜ npm run build
# Запуск продуктовой сборки
➜ npm run start
```

### Настройка

Настройка приложения осуществялется через переменные окружения, которые хранятся в `.env`
файлах.

Пример переменных окружения со значениями: [.env.sample](./.env.sample)

#### 1. Установка зафиксированных зависимостей

```bash
# Установка зависимостей, которые зафиксированы в package-lock.json файле
➜ npm ci
```

#### 2. Запуск миграций

```bash
# Для локальной разработки
➜ npx prisma migrate dev
# Для продуктовой разработки
➜ npx prisma migrate deploy
```

#### 3. [Опционально] Генерация описания сущностей СУБД и работа с моделями

```bash
# Доступ к спецификации будет доступен на 5858 порту
➜ npm run prisma:docs
# Запускает утилиту, которую предоставляет сама Prisma для управления СУБД на основе моделей
➜ npx prisma studio
```

#### 4. Запуск

Для запуска приложения с HotReloader-ом и FileWatcher-ом необходимо выполнить:

```bash
➜ npm run dev
```

#### 5. Проверка работоспособности

В сервисе реализована интеграция с системой IVA R, а также с объектным хранилищем S3.

Для проверки работоспособности интеграций, можно выполнить `GET` запрос по пути
`http[s]://[hostname]:[port]/health`.

Например с использование `cURL`:

```bash
➜ curl --location 'http://localhost:3000/health'
```

#### 6. [Опционально] Настройка локального окружения через NixOS

[Пакетный менеджер NIX](https://nixos.org/download).

Поддержка OS:

- Linux
- WSL
- MaxOS

Для установки пакетного менеджера:

```bash
➜ sh <(curl -L https://nixos.org/nix/install) --daemon
```

После установки необходимо включить эксперементальные функции

Для этого необходимо добавить опцию для в `~/.config/nix/nix.conf` или
`/etc/nix/nix.conf`:

```bash
experimental-features = nix-command flakes
```

Инициализация dev-окружения

```bash
➜ nix develop .
```

Установка зависимостей:

```bash
➜ npm install
```

Копирование файла с переменными окружения .env:

```bash
➜ cp .env.sample .env
```

Инициализация БД:

```bash
➜ npx prisma generate
➜ npx prisma migrate dev
```

Запуск dev-сервера:

```bash
➜  npm run dev
```

### Запуск тестов

```bash
➜ npm run test
```
