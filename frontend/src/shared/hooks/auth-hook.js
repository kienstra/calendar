import { useState, useCallback, useEffect } from 'react';

const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_MINUTES = 60;

// Not in state becuase it should not cause a re-render.
let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);

  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  // Only runs once because of useCallback.
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + SECOND_IN_MILLISECONDS * MINUTE_IN_SECONDS * HOUR_IN_MINUTES);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      // If there's not token or tokenExpirationDate, there's no need for the setTimeout anymore.
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // If the expiration date is in the future.
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };
};
