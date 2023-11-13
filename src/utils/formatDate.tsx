// Функция для форматирования даты
export function formatDate(dateString: string): string {
  // Преобразовать входную строку в объект Date
  const date = new Date(dateString);
  
  // Получить день из даты, преобразовать его в строку и, если необходимо, добавить начальный ноль
  const day = date.getDate().toString().padStart(2, '0');
  
  // Получить месяц из даты (начиная с 0), прибавить 1, преобразовать в строку и, если необходимо, добавить начальный ноль
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  // Получить год из даты и преобразовать его в строку
  
  const year = date.getFullYear().toString();
  // Вернуть отформатированную дату в формате ДД.ММ.ГГГГ
  return `${day}.${month}.${year}`;
}