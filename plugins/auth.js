import { PublicClientApplication } from '@azure/msal-browser';
import { useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin((app) => {
    const config = useRuntimeConfig();
    // console.log(Date().toString('yyyy-MM-dd HH:mm:ss'));
    // console.log(config);
    const msalConfig = {
        auth: {
            clientId: config.azure.clientId,
            authority: `https://login.microsoftonline.com/${config.azure.tenantId}`,
            redirectUri: config.azure.redirectUri,
        }
    };
    // console.log(Date().toIsoString.toString('yyyy-MM-dd HH:mm:ss'));   
    // console.log(msalConfig);
    const msalInstance = new PublicClientApplication(msalConfig);
});

export async function login() {
    const loginRequest = {
        scopes: ["openid", "profile", "User.Read"],
    };

    try {
        const response = await msalInstance.loginPopup(loginRequest);
        return response.account;
    } catch (error) {
        console.error(error);
    }
};

export function logout() {
    msalInstance.logoutRedirect();
}

export async function getToken() {
    const tokenRequest = {
        scopes: ["openid", "profile", "User.Read"],
    };

    try {
        const response = await msalInstance.acquireTokenSilent(tokenRequest);
        return response.accessToken;
    } catch (error) {
        if (error instanceof msalInstance.InteractionRequiredAuthError) {
            const response = await msalInstance.acquireTokenPopup(tokenRequest);
            return response.accessToken;
        } else {
            console.error(error);
        }
    }
};

// --------
// import { login, logout, getToken } from '@/auth.js'

// export default function ({app}, inject) {
//     inject("login", login);
//     inject("logout", logout);
//     inject("getToken", getToken);
// }

