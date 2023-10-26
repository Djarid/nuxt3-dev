export default function ({ app, redirect }) {
    const isAuthenticated = !!app.$auth.account;

    if (!isAuthenticated) {
        return redirect('/login')
    }
}