package org.unamur.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;
import javax.inject.Inject;

import org.bson.types.ObjectId;
import org.jose4j.jwt.consumer.JwtContext;
import org.unamur.configuration.SecurityConfig;
import org.unamur.entity.RefreshTokenEntity;
import org.unamur.repository.RefreshTokenRepository;

import io.quarkus.arc.Priority;
import io.smallrye.jwt.auth.principal.DefaultJWTCallerPrincipal;
import io.smallrye.jwt.auth.principal.DefaultJWTTokenParser;
import io.smallrye.jwt.auth.principal.JWTAuthContextInfo;
import io.smallrye.jwt.auth.principal.JWTCallerPrincipal;
import io.smallrye.jwt.auth.principal.JWTCallerPrincipalFactory;
import io.smallrye.jwt.auth.principal.ParseException;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.build.JwtClaimsBuilder;

@ApplicationScoped
@Alternative
@Priority(1)
public class JWTService extends JWTCallerPrincipalFactory implements IJWTService {

    @Inject
    SecurityConfig securityConfig;

    @Inject
    RefreshTokenRepository refreshTokenRepository;

    private PrivateKey signingKey;
    private PublicKey verifyKey;

    private final DefaultJWTTokenParser parser = new DefaultJWTTokenParser();

    @PostConstruct
    public void init() throws KeyStoreException, NoSuchAlgorithmException, CertificateException,
            IOException, UnrecoverableKeyException, InvalidKeySpecException {

        try (FileInputStream is = new FileInputStream(securityConfig.keystore())) {
            KeyStore keystore = KeyStore.getInstance(KeyStore.getDefaultType());
            char[] passwd = securityConfig.password().toCharArray();
            keystore.load(is, passwd);
            signingKey = (PrivateKey) keystore.getKey(securityConfig.accessToken().alias(), passwd);
            RSAPrivateCrtKey privk = (RSAPrivateCrtKey) signingKey;
            RSAPublicKeySpec publicKeySpec = new java.security.spec.RSAPublicKeySpec(privk.getModulus(),
                    privk.getPublicExponent());
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            verifyKey = keyFactory.generatePublic(publicKeySpec);
        }
    }

    @Override
    public JWTCallerPrincipal parse(String token, JWTAuthContextInfo authContextInfo) throws ParseException {
        authContextInfo.setPublicVerificationKey(verifyKey);
        JwtContext jwtContext = parser.parse(token, authContextInfo);
        String type = jwtContext.getJoseObjects().get(0).getHeader("typ");
        return new DefaultJWTCallerPrincipal(type, jwtContext.getJwtClaims());
    }

    @Override
    public String generateAccessToken(String subject) {
        return generateAccessToken(subject, new HashMap<>());
    }

    @Override
    public String generateAccessToken(String subject, Map<String, Object> claims) {
        return generateToken(subject, claims, securityConfig.accessToken());
    }

    @Override
    public String generateRefreshToken(String subject) {
        return generateRefreshToken(subject, new HashMap<>());
    }

    @Override
    public String generateRefreshToken(String subject, Map<String, Object> claims) {
        claims.remove("scopes");
        Set<String> scopes = new HashSet<>();
        scopes.add("refresh");
        claims.put("scopes", scopes);
        return generateToken(subject, claims, securityConfig.refreshToken());
    }

    private String generateToken(String subject, Map<String, Object> claims, SecurityConfig.TokenConfig config) {
        JwtClaimsBuilder builder = Jwt.claims();
        builder
                .issuer(config.issuer())
                .audience(config.audiences())
                .expiresIn(config.timeToLive())
                .subject(subject)
                .jws()
                .keyId(config.alias());

        claims.entrySet().forEach(entry -> builder.claim(entry.getKey(), entry.getValue()));
        //Jwt.groups(new HashSet<>(Arrays.asList("User", "Admin"))) ;
        String token = builder.sign(signingKey);

        RefreshTokenEntity refreshTokenEntity = new RefreshTokenEntity();
        refreshTokenEntity.setId(new ObjectId());
        refreshTokenEntity.setToken(token);
        refreshTokenRepository.persist(refreshTokenEntity);

        return token;
    }

}