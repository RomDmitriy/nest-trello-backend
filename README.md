# Nest-Trello-Backend
### Инструкция:
#### **Если используете Docker (чтобы не ставить PostgreSQL локальным сервером)**:
1) В директории `server/` переименовать `.env.docker` в `.env`.
2) Из корня проекта запустить проект вместе с PostgreSQL командой `docker-compose up`.
3) Не завершая контейнер с PostgreSQL, из директории `server/` пропишите команды `npm i -D prisma` и `npx prisma db push`. Это создаст структуру БД в PostgreSQL из Docker-контейнера и скомпилирует модели для их использования в коде.
4) Перезапустите контейнер с Backend'ом.

#### **Если используете собственный сервер PostgreSQL**
1) В директории `server/` переименовать `.env.local` в `.env`.
2) В `.env` изменяете ссылку на PostgreSQL на вашу.
3) Из директории `server/` пропишите команду `npx prisma db push`. Это создаст структуру БД в PostgreSQL из Docker-контейнера. Если там раньше была какая-то структура, то могут быть проблемы.
4) Запускайте Backend командой `npm start`.

### Схема БД:
![image](https://github.com/user-attachments/assets/b04abaa5-e9c7-4f5b-9692-0478af0734b7)
