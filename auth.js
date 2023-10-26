import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: config.azure.clientId,
        authority: `https://login.microsoftonline.com/${config.azure.tenantId}`,
        redirectUri: config.azure.redirectUri,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

async function login() {
    const loginRequest = {
        scopes: ["openid", "profile", "User.Read"],
    }
}

function logout() {
    msalInstance.logoutRedirect();
}

async function getToken() {
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
}

export { login, logout, getToken };

