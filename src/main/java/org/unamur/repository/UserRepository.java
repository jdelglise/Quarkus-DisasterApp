package org.unamur.repository;

import java.util.Optional;

import javax.enterprise.context.ApplicationScoped;

import org.unamur.entity.UserEntity;

import io.quarkus.mongodb.panache.PanacheMongoRepository;

/**
 * See https://quarkus.io/guides/mongodb-panache - option 2
 */

@ApplicationScoped
public class UserRepository implements PanacheMongoRepository<UserEntity> {
    // put your custom logic here as instance methods

    public Optional<UserEntity> findByLoginOptional(String login) {
        return find("login", login).firstResultOptional();
    }

}
