package org.unamur.repository;

import java.util.Optional;

import javax.enterprise.context.ApplicationScoped;

import org.unamur.entity.RefreshTokenEntity;

import io.quarkus.mongodb.panache.PanacheMongoRepository;

@ApplicationScoped
public class RefreshTokenRepository implements PanacheMongoRepository<RefreshTokenEntity> {

    public Optional<RefreshTokenEntity> findByTokenOptional(String token) {
        return find("token", token).firstResultOptional();
    }
}
