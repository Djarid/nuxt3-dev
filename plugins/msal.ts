// https://github.com/Akash52/msal-with-nuxt3/blob/main/plugins/msal.ts

import {
    PublicClientApplication,
    BrowserCacheLocation,
    EventType,
  } from "@azure/msal-browser";
import { defineNuxtPlugin } from "nuxt/app";
  
let tokenExpirationTimer: any;

export default defineNuxtPlugin(async ({ $config }) => {
  const msalConfig = {
    auth: {
      clientId: 'ac80c24e-2c2e-43e8-8a4e-00a18c3f410f', // config.azure.clientId,
      authority: `https://login.microsoftonline.com/7f6be8f0-7bfc-4eb2-9c19-c5ea41dcafeb`, // ${config.azure.tenantId}`,
      redirectUri: 'https://localhost:3000/', // config.azure.redirectUri,
      // clientId: $config.azure.clientId,
      // authority: `https://login.microsoftonline.com/7f6be8f0-7bfc-4eb2-9c19-c5ea41dcafeb`, // ${config.azure.tenantId}`,
      // redirectUri: $config.azure.redirectUri,
      postLogoutRedirectUri: 'https://localhost:3000',  // $config.azure.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true,
    },
    system: {
      tokenRenewalOffsetSeconds: 300,
    },
  };

  const msalInstance = new PublicClientApplication(msalConfig);
  await msalInstance.initialize();

  // Handle redirect promise after login or redirect
  await msalInstance
    .handleRedirectPromise() // Handles the redirect promise and obtains the response
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err);
    });

  // Add event callback for login success
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      setupTokenExpirationTimer();
    }
  });

  // Set up timer for refreshing access token upon expiration
  function setupTokenExpirationTimer() {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      if (account.idTokenClaims && account.idTokenClaims.exp) {
        const tokenExpirationTime = account.idTokenClaims.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiration = tokenExpirationTime - currentTime;

        clearTimeout(tokenExpirationTimer);

        tokenExpirationTimer = setTimeout(() => {
          refreshAccessToken(account);
        }, timeUntilExpiration);
      }
    }
  }

  // Refresh access token
  async function refreshAccessToken(account: any) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        account,
        // scopes: ["User.Read"],
        scopes: ["api://ac80c24e-2c2e-43e8-8a4e-00a18c3f410f/user_impersonation"],
      });
      console.log("Refreshed Access Token:", response.accessToken);
      setupTokenExpirationTimer();
    } catch (err) {
      console.error("Token refresh error:", err);
      signOut(account.homeAccountId);
    }
  }

  // Handle the response after login or redirect
  function handleResponse(resp: any) {
    if (resp?.account) {
      console.log("LOGIN SUCCESS");
      setupTokenExpirationTimer();
    } else {
      console.log("LOGIN");
    }
  }

  // Acquire access token silently
  async function acquireTokenSilent() {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      msalInstance.setActiveAccount(account);
      try {
        const response = await msalInstance.acquireTokenSilent({
          account,
          scopes: ["User.Read"],
          // scopes: ["api://ac80c24e-2c2e-43e8-8a4e-00a18c3f410f/user_impersonation"],
        });
        return response.accessToken;
      } catch (err) {
        return null;
      }
    } else {
      console.error("No accounts found");
      return null;
    }
  }

  const loginRequest = {
    scopes: ["User.Read"],
    // scopes: ["api://ac80c24e-2c2e-43e8-8a4e-00a18c3f410f/user_impersonation"],
  };

  // Sign in with redirect
  async function signIn() {
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      console.log("Login error:", err);
    }
  }

  // Get all MSAL accounts
  function getAccounts() {
    return msalInstance.getAllAccounts();
  }

  // Check if user is authenticated
  function isAuthenticated() {
    return getAccounts().length > 0;
  }

  // Sign out user
  function signOut(accountId: string) {
    const account = accountId ? msalInstance.getAccountByHomeId(accountId) : null;
    if (account) {
      msalInstance.logoutRedirect({account});
      localStorage.clear();
    } else {
      console.error("Account not found");
    }
  }

  const msalObj = {
    signIn,
    getAccounts,
    isAuthenticated,
    signOut,
    acquireTokenSilent,
  };

  return {
    provide: {
      msal: () => msalObj,
    },
  };
});
