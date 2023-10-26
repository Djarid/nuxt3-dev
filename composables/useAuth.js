import * as msal from '@azure/msal-browser'

let state = {
    applicationInstance: null,  
}

export const useAuth = () => {
    //config auth
    const msalConfig = {
        auth: {
            clientId: 'ac80c24e-2c2e-43e8-8a4e-00a18c3f410f', //config.azure.clientId,
            authority: `https://login.microsoftonline.com/7f6be8f0-7bfc-4eb2-9c19-c5ea41dcafeb`, //${config.azure.tenantId}`,
            redirectUri: '/blank.html', //config.azure.redirectUri,            
            knownAuthorities: ['']
        },
        cache: {
            cacheLocation: "sessionStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        },
    }
    state.applicationInstance = new msal.PublicClientApplication(msalConfig);

    return {
        signIn
    }
}

const signIn = () => {
    //handle redirect
    state.applicationInstance
        .addEventCallback(event => {
            if(event.type == "msal:loginSuccess" && event.payload.account)
            {   
                const account = event.payload.account
                state.applicationInstance.setActiveAccount(account)
                console.log(account)
            }
        })

    //handle auth redirect
    state.applicationInstance
        .handleRedirectPromise()
        .then(() => {
            const account = state.applicationInstance.getActiveAccount()
            if(!account) {
                const requestParams = {
                    scopes: ['openid', 'offline_access', 'User.Read'],
                }
                state.applicationInstance.loginRedirect(requestParams)
            }
        })
}