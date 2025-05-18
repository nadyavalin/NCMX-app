# NCMX-app

**NCMX-app** — это веб-приложение ведения реестра несоответствий, наблюдений и возможностей для улучшения, добавления комментариев к ним, сохранения истории комментариев, отслеживания сроков выполнения, закрытия несоответствий с оценкой, переноса в архив после закрытия.

#### Что реализовано из функционала (без учёта UI):

- добавление несоответствий;
- добавление комментариев к несоответствиям (у одного несоответствия может быть несколько комментариев);
- возможность просмотра истории комментариев.

#### Что планируется реализовать в ближайшее время:

- изменение и удаление несоответствий;
- изменение и удаление комментариев;
- улучшить UI и функционал модального окна для добавления несоответствий;

#### Что планируется реализовать:

- оценка несоответствия с последующим закрытием и переносом в архив;
- UI и функционал архивирования закрытых записей;
- добавление (а также изменение и удаление) наблюдений и комментариев к ним;
- добавление (а также изменение и удаление) возможностей для улучшения и комментариев к ним;
- управление пользователями, чтобы они могли при входе в систему автоматически (по логину/паролю системы) попадать в данное приложение с целью внесения комментариев к несоответствию, наблюдение, возможности для улучшения своего подразделения;
- система оповещения в случае, если срок реализации коррекции/корректирующего действия подходит к концу;
- расширенные фильтры и поиск;
- дашборд с визуализацией количества несоответствий, наблюдений и предложений по подразделениям и статусам;
- история изменений;
- оптимизация интерфейса для мобильных устройств;
- экспорт данных в Excel/PDF;
- юнит-тесты для Django;
- логирование действий пользователей

Подробная дорожная карта развития проекта доступна в [ROADMAP.md](https://github.com/nadyavalin/NCMX-app/blob/develop/ROADMAP.md).

Серверная часть построена на Django с PostgreSQL, а фронтенд — на Next.js. API доступен по адресу `http://localhost:8000/ncmx_app/api`.

## Требования

- **Python** 3.12+
- **Node.js** 18+ и npm
- **PostgreSQL** 16+ (порт 5433)
- **Git** (для клонирования репозитория)
- **VSCode** (рекомендуется) с терминалом `cmd.exe` или PowerShell

## Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/nadyavalin/NCMX-app.git
```

```bash
cd NCMX-app
```

### 2. Настройка PostgreSQL

1. Установите PostgreSQL 16: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

   - Порт: `5433`
   - Пользователь: `postgres`
   - Пароль: `root`

2. Запустите службу PostgreSQL:

   ```bash
   net start postgresql-x64-16
   ```

3. Создайте базу данных:
   ```bash
   psql -U postgres -h localhost -p 5433
   ```
   ```sql
   CREATE DATABASE ncmx_db;
   GRANT ALL ON SCHEMA public TO postgres;
   \q
   ```

### 3. Настройка серверной части (Django)

1. Перейдите в директорию `server`:

   ```bash
   cd server
   ```

2. Создайте и активируйте виртуальное окружение:

   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Для Windows
   ```

3. Установите зависимости:

   ```bash
   pip install -r requirements.txt
   ```

   _Примечание_: Убедитесь, что `psycopg2-binary` установлен (`pip install psycopg2-binary`).

4. Настройте `.env` (опционально, для безопасности):
   ```bash
   pip install python-decouple
   ```
   Создайте файл `server/.env`:
   ```text
   DB_NAME=ncmx_db
   DB_USER=postgres
   DB_PASSWORD=root
   DB_HOST=localhost
   DB_PORT=5433
   ```
   Обновите `settings.py`:
   ```python
   from decouple import config
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': config('DB_NAME'),
           'USER': config('DB_USER'),
           'PASSWORD': config('DB_PASSWORD'),
           'HOST': config('DB_HOST'),
           'PORT': config('DB_PORT'),
       }
   }
   ```
5. Примените миграции:

   ```bash
   python manage.py migrate
   ```

6. Создайте суперпользователя (для админки):
   ```bash
   python manage.py createsuperuser
   ```

### 4. Настройка фронтенд части (Next.js)

1. Перейдите в корневую директорию проекта:

   ```bash
   cd <ваш-путь>/NCMX-app
   ```

   или

   ```bash
   cd ..
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```
3. Настройте `.env.local`:
   Создайте или проверьте файл `.env.local`:
   ```text
   NEXT_PUBLIC_API_URL=http://localhost:8000/ncmx_app/api
   ```

### 5. Запуск приложения

#### Серверная часть

1. Перейдите в `server`:

   ```bash
   cd server
   ```

2. Запустите Django-сервер:
   ```bash
   python manage.py runserver 8000
   ```
   или
   ```bash
   ./manage.py runserver
   ```
   API будет доступен по адресу: `http://localhost:8000/ncmx_app/api`.

#### Фронтенд часть

1. В другой вкладке терминала перейдите в корневую директорию:

   ```bash
   cd <ваш-путь>/NCMX-app
   ```

   или

   ```bash
   cd ..
   ```

2. Запустите Next.js в режиме разработки:
   ```bash
   npm run dev
   ```
   или режиме production:
   ```bash
   npm run start
   ```
   Приложение будет доступно по адресу: `http://localhost:3000`.

### 6. Работа с данными

- **Через админку Django**: Откройте `http://localhost:8000/admin/` и войдите с данными суперпользователя.
- **Через API**:
  ```bash
  curl -X POST http://localhost:8000/ncmx_app/api/ncmx-table/ \
  -H "Content-Type: application/json" \
  -d '{"num_nonconf": 1, "nonconf": "Test Inconsistency", "norm_doc": "ISO 9001"}'
  ```
  ```bash
  curl -X POST http://localhost:8000/ncmx_app/api/ncmx-comments/ \
  -H "Content-Type: application/json" \
  -d '{"num_nonconf": 1, "comment_author": "Алтаева О.Ю.", "comment_text": "Тестовый комментарий"}'
  ```
- **Через Django Shell**:
  ```bash
  python manage.py shell
  ```
  ```python
  from inconsistencies.models import NCMXInconsistencies, NCMXInconsistencyComments
  NCMXInconsistencies.objects.create(num_nonconf=1, nonconf="Test Inconsistency", norm_doc="ISO 9001")
  NCMXInconsistencyComments.objects.create(num_nonconf_id=1, comment_author="Алтаева О.Ю.", comment_text="Тестовый комментарий")
  ```

### 7. Работа с PostgreSQL

- **Подключение**:
  ```bash
  psql -U postgres -h localhost -p 5433 -d ncmx_db
  ```
- **Просмотр таблиц**:
  ```sql
  \dt
  \d NCMX_inconsistency_comments
  SELECT * FROM NCMX_inconsistency_comments;
  ```
- **Резервное копирование**:
  ```bash
  pg_dump -U postgres -h localhost -p 5433 ncmx_db > ncmx_db_backup.sql
  ```

### 8. Устранение проблем

- **Предупреждение о кодировке в Git Bash**:
  Переключитесь на `cmd.exe` в VSCode:
  ```json
  "terminal.integrated.defaultProfile.windows": "Command Prompt"
  ```
  В `cmd`:
  ```bash
  chcp 1251
  psql -U postgres -h localhost -p 5433
  ```
  Или используйте PowerShell:
  ```json
  "terminal.integrated.defaultProfile.windows": "PowerShell"
  ```
  ```powershell
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  ```
- **Ошибка подключения к PostgreSQL**:
  Проверьте, запущена ли служба:
  ```bash
  net start postgresql-x64-16
  ```
  Проверьте порт:
  ```bash
  netstat -ano | findstr :5433
  ```
- **Права на схему**:
  ```bash
  psql -U postgres -h localhost -p 5433 -d ncmx_db
  ```
  ```sql
  GRANT ALL ON SCHEMA public TO postgres;
  ```

### 9. Дополнительно

- **Админка**: `http://localhost:8000/admin/` для управления данными.
- **API-документация**: Проверьте эндпоинты в `http://localhost:8000/ncmx_app/api`.
- **Тестовые данные**: Используйте `python manage.py seed_data` (если реализована).

### 10. Комментарии разработчика

Приложение не закончено. README.md периодически будет обновляться.
