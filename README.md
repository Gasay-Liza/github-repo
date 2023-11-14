# React приложение для поиска Github репозиториев
### Gh-pages
[Ссылка на деплой](gasay-liza.github.io/github-repo/)

## Функциональность

Приложение предоставляет следующую функциональность:

* Поиск репозиториев GitHub с использованием GraphQL API.
* Отображение результатов поиска в виде таблицы со следующими столбцами: название, язык, число форков, число звёзд, дата обновления.
* Возможность выбрать строку, чтобы просмотреть детали выбранного репозитория, включая название, описание и лицензию.
* Пагинация для удобного перехода между страницами результатов поиска.
* Сортировка по направлению для столбцов: число звёзд, число форков, дата обновления.

## Дизайн

[Figma](https://www.figma.com/file/XtOoRhJBLDywBS7Or21FNJ/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B5-%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5?type=design&node-id=0-1&mode=design)

## Технологии

Приложение разработано с использованием следующих технологий и библиотек:

* Язык программирования: TypeScript
* Стилизация: Sass с использованием CSS Modules
* Библиотека компонентов: MUI (Material-UI)
* Управление состоянием: Redux Toolkit
* Интеграция с API: GitHub GraphQL API

## Как запустить приложение


Для запуска приложения, выполните следующие шаги:

1. Убедитесь, что у вас установлен Node.js и npm (Node Package Manager) на вашем компьютере.
2. Склонируйте репозиторий на ваш локальный компьютер.
   `git clone https://github.com/Gasay-Liza/github-repo.git`
3. Перейдите в директорию проекта.
4. Установите зависимости проекта:
   `npm install`
4. Выполните сборку проекта:
`npm run build`
5. Запустите приложение :
`npm run start`

В браузере откроется приложение по адресу http://localhost:3000.
