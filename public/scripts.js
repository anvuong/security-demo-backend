const readLocalStorage = () => {
  const storageInfos = [];
  const storageLength = localStorage.length;
  for (let i = 0; i < storageLength; i += 1) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    storageInfos.push({ key, value });
  }
  alert(`${JSON.stringify(storageInfos, null, 2)}`);
};

readLocalStorage();