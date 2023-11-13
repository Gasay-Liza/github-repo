// Тип "Order" определяет возможные направления сортировки: 'asc' для возрастания и 'desc' для убывания.
export type Order = 'asc' | 'desc';

// Функция 'descendingComparator' сравнивает два объекта по указанному ключу и возвращает результат сравнения.
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // Если значение объекта 'b' равно null или меньше, чем значение объекта 'a', и при этом значение 'a' не равно null, вернуть -1
  if ((b[orderBy] === null || b[orderBy] < a[orderBy]) && a[orderBy] !== null) {
      return -1;
  }
  // Если значение объекта 'a' равно null или больше, чем значение объекта 'b', и при этом значение 'b' не равно null, вернуть 1
  if ((a[orderBy] === null || b[orderBy] > a[orderBy]) && b[orderBy] !== null) {
    return 1;
  }
  // Если ни одно из условий не выполняется, вернуть 0 (т.е. значения равны)
  return 0;
}

// Функция 'getComparator' возвращает компаратор (функцию сравнения) в зависимости от заданного направления сортировки ('order') и поля сортировки ('orderBy').
export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | null },
  b: { [key in Key]: number | string | null },
) => number {
  // Если задано направление сортировки 'desc', вернуть функцию 'descendingComparator'
  // В противном случае, вернуть функцию, возвращающую отрицательное значение 'descendingComparator' (т.е. выполняется сортировка по возрастанию)
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Функция 'stableSort' производит стабильную сортировку массива с помощью переданной функции 'comparator'.
export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  // 'stabilizedThis' - это массив, каждый элемент которого является парами [элемент, индекс]
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);

  // Сортируем 'stabilizedThis', используя переданную функцию сравнения
  stabilizedThis.sort((a, b) => {
    // Вычисляем 'order' - результат сравнения элементов 'a' и 'b'
    const order = a[0] !== null && b[0] !== null ? comparator(a[0], b[0]) : 0;
    
    // Если 'order' не равно 0, возвращаем его значение (элементы 'a' и 'b' не равны)
    // Иначе возвращаем разность их индексов (обеспечиваем стабильность сортировки)
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  // Возвращаем отсортированный массив, проектируя каждый элемент массива 'stabilizedThis' обратно в его первый компонент (т.е. исходный элемент)
  return stabilizedThis.map((el) => el[0]);
}