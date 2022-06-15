package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;
import org.bson.types.ObjectId;
import org.unamur.Constants.CategoryType;

import java.util.Date;
import java.util.List;

@Data
@MongoEntity(collection = "Category")
public class CategoryEntity {

    private ObjectId id; // used by MongoDB for the _id field
    private String name;
    private CategoryType type;
    private List<CustomFormFieldEntity> customFields;
    private int expirationInDays;
    private boolean disabled;
    private Date creationDate;
    private int priority;
}
