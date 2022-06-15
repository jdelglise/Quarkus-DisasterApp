package org.unamur.configuration;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;

@ConfigMapping(prefix = "groupe4.security")
public interface SecurityConfig {

    String keystore();

    String password();

    TokenConfig accessToken();

    TokenConfig refreshToken();

    public interface TokenConfig {
        String alias();

        String issuer();

        String audiences();

        @WithDefault("300")
        int timeToLive();
    }
}
