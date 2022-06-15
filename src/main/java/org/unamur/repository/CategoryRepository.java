package org.unamur.repository;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import org.unamur.entity.CategoryEntity;

import javax.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * See https://quarkus.io/guides/mongodb-panache - option 2
 */

@ApplicationScoped
public class CategoryRepository implements PanacheMongoRepository<CategoryEntity> {
    // put your custom logic here as instance methods
    public Optional<CategoryEntity> findByNameOptional(String name) {
        return find("name", name).firstResultOptional();
    }


    public Optional<CategoryEntity> findByNameAndTypeOptional(String name, String type) {
        Optional<CategoryEntity> returnCategory = Optional.empty();

        List<CategoryEntity> tempList = find("name", name).list();

        for (CategoryEntity category : tempList) {
            if(category.getType().name().equals(type)) {
                returnCategory = Optional.of(category);
            }
        }
        
        return returnCategory;
    }

    public List<CategoryEntity> findByTypeOptional(String type) {
        return find("type", type).list();
    }


}