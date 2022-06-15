package org.unamur.repository;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import org.unamur.entity.EntityEntity;

import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;

/**
 * See https://quarkus.io/guides/mongodb-panache - option 2
 */

@ApplicationScoped
public class EntityRepository implements PanacheMongoRepository<EntityEntity> {
    // put your custom logic here as instance methods
    public Optional<EntityEntity> findByNameOptional(String name) {
        return find("name", name).firstResultOptional();
    }


}