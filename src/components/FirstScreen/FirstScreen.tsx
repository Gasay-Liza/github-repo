import React, { useState } from 'react';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Как только пользователь начинает поиск, мы устанавливаем `isSearchActive` в true
    setIsSearchActive(true);
    // Здесь должен быть код для выполнения поискового запроса
    console.log(searchTerm);
  };

  return (
    <div>
      {/* 
        Если `isSearchActive` равен false, мы показываем приветствующий контейнер 
        Как только `isSearchActive` становится true, контейнер скрывается
      */}
      {!isSearchActive && <div>Добро пожаловать!</div>}
  
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Введите поисковый запрос"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Найти</button>
      </form>
    </div>
  );
};

export default MyComponent;