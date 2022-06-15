# Security configuration

## TLS

All the related configuration can be found at the following location :

`src\main\resources`

- application.yaml

```
  http:
      insecure-requests: REDIRECT
      ssl-port: 8443
      ssl:
        client-auth: REQUEST
        certificate:
          key-store-file-type: JKS
          key-store-file: src\main\resources\server-keystore.jks
          key-store-password: secret
          trust-store-file: src\main\resources\server-truststore.jks
          trust-store-password: secret
      auth:
        proactive: true
```

- server-keystore.jks

Contains the private/public key for the backend server.

- server-truststore.jks

Contains the client private/public key for the client application. The goal is to use it for our tests.

**Important :** A proper truststore should be set, here we actually used the client keystore. So it means we have the client private key, and this is a security issue.
We will consider this as acceptable for dev

## Redirect

All the call to the unsecured port will be automatically redirected to the https endpoint.

## Certificate

Currently, self-signed certificates are used. This solution is **acceptable** for **development**, **but not for production**

The following commands were used to create the two keystore :

```
  keytool -genkeypair -storepass secret -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore server-keystore.jks
  keytool -genkeypair -storepass secret -keyalg RSA -keysize 2048 -dname "CN=client" -alias client -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore server-truststore.jks
```

## Generate a PKCS

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj /CN=MyHost.com
openssl pkcs12 -export -in cert.pem -inkey key.pem -out myfile.p12 -name "Alias of cert"
```
