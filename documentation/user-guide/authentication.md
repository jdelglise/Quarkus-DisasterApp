# Authentication User Guide

Hi !

In this chapter we will see how the authentication flow is setup for you.
You will discover how it works, the main endpoints available, the interactions with the database and how you can modify it.
It's a tought part but we tried to make it fun and readable.

## A world of JWT

Since the frontend logic is executed directly in the user browser, a good and often used solution is the usage of `JWT`.
Basicaly a JWT is a base64 encoded string containing a few data about the user. This token is supposed to be secret but it's not a big deal if you lost one since no login information are stored inside and they have a short expiry time.

The most interesting with JWTs is that our server is able to ensure that it emits the JWT itself and that no one altered data.
We sign the content of the token with a private key stored in `src/main/resource/security/keystore.p12`.
**This is a dummy pkcs. Make sure you generate a new one before you go live !**

If you want to learn more about JWTs you can find a nice explation [here](https://stormpath.com/blog/beginners-guide-jwts-in-java)
For the rest of this chapter, we assume you know a bit about these tokens.

When you enter the application, you will provide once your user/password and receive 2 tokens:

- The `access_token`: A token with your authorization usable for a short period.
- The `refresh_token`: A token without your authorization with a longer delay before expiration allowing you to claims a new tokens pair without giving again your credentials.

## Endpoints

We expose 4 auth endpoint in `org.unamur.resource.AuthResources`.

> If you need more details about these endpoints, you can check their definition in `src/main/resource/api.yaml`

- `/auth/login`: This route takes your credentials and give you a token pair (and some extra data) in exchange.
- `/auth/register`: Give information about you and this route will generate a user for you.
- `/auth/refresh`: Pass your refresh token and it will generates a new token pair in exchange.
  > Note that a refresh token can be used only once !
- `/auth/revoke`: Pass a refresh token and it wont be usable any longer. We do that when you logout. Also, when a user think he's compromised, he can revoke it manually (or asks you to do it 😁 )

##
