// IPrimaryLanguage - интерфейс, определяющий структуру основного языка кода используемого в репозитории 
export interface IPrimaryLanguage {
    name: string; // Название языка кода
}

// INode - интерфейс информация о репозитории GitHub
export interface INode {
    name: string; // Имя репозитория
    repositoryTopics: { // Теги репозитория
        nodes: {
            topic: {
                name: string | null; // Название тега
            }
        }[]
    }
    licenseInfo: { // Информация о лицензии репозитория
        name: string | null; // Название лицензии
    }
    primaryLanguage: IPrimaryLanguage | null; // Основной язык кода в репозитории
    forkCount: number; // Количество форков (клонов разработки) репозитория
    stargazerCount: number; // Количество звезд (отметок "Мне нравится") у репозитория
    updatedAt: string; // Дата последнего обновления репозитория
}

// IEdge - интерфейс, описывающий набор данных, связанных с репозиторием и курсором для пагинации
export interface IEdge {
    node: INode; // Данные о репозитории
    cursor: string; // Курсор для пагинации
}

// IRepository - интерфейс, определяющий структуру информации о репозиториях
export interface IRepository {
    repositoryCount: number | null; // Общее количество репозиториев
    pageInfo: { // Информация для пагинации
        startCursor: string; // Начальный курсор для пагинации
        hasNextPage: boolean; // Флаг, указывающий, есть ли следующая страница для пагинации
        endCursor: string; // Конечный курсор для пагинации
    },
    edges: IEdge[]; // Массив данных о репозиториях и курсорах для пагинации
}

// ISortedData - интерфейс для описания отсортированных данных о репозитории
export interface ISortedData {
    id: string; // Уникальный идентификатор репозитория
    name: string; // Имя репозитория
    language: string | null; // Основной язык программирования репозитория
    forks: number; // Количество форков репозитория
    stars: number; // Количество звезд у репозитория
    date: string; // Дата последнего обновления репозитория
}

// IRepositoriesState - интерфейс для описания состояния хранилища репозиториев
export interface IRepositoriesState {
    isSearchActive: boolean,
    searchTerm: string, // Поисковый запрос
    data: IRepository | null, // Данные репозиториев
    loading: boolean, // Флаг загрузки данных
    error: string | null, // Информация об ошибках
    endCursorHistory: string[], // История конечных курсоров для пагинации
    startCursorHistory: string[], // История начальных курсоров для пагинации
    hasNextPage: boolean | null, // Флаг наличия следующей страницы
    sortedData: ISortedData[], // Отсортированные данные репозиториев
}

// Начальное состояние хранилища репозиториев.
export const initialState: IRepositoriesState = {
    isSearchActive: false,
    searchTerm: "",
    data: null,
    loading: false,
    error: null,
    endCursorHistory: [],
    startCursorHistory: [],
    hasNextPage: false,
    sortedData: [],
};

// QueryVariables - интерфейс для переменных, используемых в API-запросе к GitHub
export interface QueryVariables {
    first?: number; // Количество первых элементов до курсора -значение для пагинации
    last?: number; // Количество первых элементов после курсора -
    after?: string; // Курсор для пагинации "после"
    before?: string; // Курсор для пагинации "до"
    query: string; // Поисковый запрос
}

// HeadCell - интерфейс для описания заголовка таблицы
export interface HeadCell {
    id: keyof ISortedData; // Уникальный идентификатор заголовка
    label: string; // Название заголовка
} 

// Тип "Order" определяет возможные направления сортировки: 'asc' для возрастания и 'desc' для убывания.
export type Order = 'asc' | 'desc';