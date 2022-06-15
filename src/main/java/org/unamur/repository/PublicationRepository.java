package org.unamur.repository;

import io.quarkus.logging.Log;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import org.bson.types.ObjectId;
import org.unamur.Constants.CategoryType;
import org.unamur.entity.CategoryEntity;
import org.unamur.entity.PublicationEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * See https://quarkus.io/guides/mongodb-panache - option 2
 */

@ApplicationScoped
public class PublicationRepository implements PanacheMongoRepository<PublicationEntity> {

    @Inject
    CategoryRepository categoryRepository;

    // put your custom logic here as instance methods
    public List<PublicationEntity> findRelatedPublications(PublicationEntity publication) {
        Optional<CategoryEntity> publicationCategory = categoryRepository.findByIdOptional(publication.getCategoryId());
        if (publicationCategory.isEmpty()){ 
            //this should never occurs, it mean it is a manual deletion in DB
            Log.error("Unknown category found the the publication " + publication.getId());
        }
        // First check if "opposite category" exist with same name, will then be first part of our strategy
        String oppositeCategoryType = CategoryType.OFFERS.name();;
        if (publicationCategory.get().getType().name().equals(CategoryType.OFFERS.name())) {
            oppositeCategoryType = CategoryType.REQUESTS.name();
        }
        
        Optional<CategoryEntity> oppositeCategory = categoryRepository.findByNameAndTypeOptional(publicationCategory.get().getName(), oppositeCategoryType);
        if (! oppositeCategory.isEmpty()) {
            return find("categoryId = ?1 and keywords in ?2", oppositeCategory.get().getId(), publication.getKeywords()).list();
        } else { // If there is not "opposite category", then we will just use the "opposite type"
            List<CategoryEntity> oppositeCategoryList = categoryRepository.findByTypeOptional(oppositeCategoryType);
            List<ObjectId> oppositeCategoryIdList = new ArrayList<ObjectId>();
            for (CategoryEntity ce : oppositeCategoryList){
                oppositeCategoryIdList.add(ce.getId());
            }
            return find("categoryId in ?1 and keywords in ?2", oppositeCategoryIdList, publication.getKeywords()).list(); 
        }
    }

    public List<PublicationEntity> findByCategory(ObjectId categoryId) {
        return find("categoryId", categoryId).list();
    }

    public List<PublicationEntity> findByCreator(ObjectId creatorId) {
        return find("creator", creatorId).list();
    }


}