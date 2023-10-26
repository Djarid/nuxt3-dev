# Nuxt3 Azure AD Auth test

## Notes

Git seems to pick up the git config from the host system. It is unlikely that all OSes will have the `crt-bundle.crt` in the same location i.e. Windows.

To get around this the `crt-bundle.crt` path should be specified in the `GIT_SSL_CAINFO` environment variable either through a docker-compose configuration or using the `.devcontainer/devcontainer.json` config

e.g.

```bash
export GIT_SSL_CAINFO="/etc/ssl/certs/ca-certificates.crt
```

or 

```json
    "containerEnv": {
        "GIT_SSL_CAINFO": "/etc/ssl/certs/ca-certificates.crt"
    }
```