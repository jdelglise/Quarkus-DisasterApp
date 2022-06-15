package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

@Data
@MongoEntity(collection = "Publication")
public class PublicationEntity {
    private ObjectId id; // used by MongoDB for the _id field
    private ObjectId categoryId; // CategoryEntity.id
    private ObjectId creator; // UserEntity.id
    private String mandated; // Here it's a string as mandated could not be registered
    private Date creationDate;
    private Date lastUpdateDate;
    private int expirationInDays;
    private String title;
    private String message;
    private List<CustomFieldValueEntity> customValues;
    private boolean closed;
    private int priority;
    private List<ObjectId> childPublicationId;
    private ObjectId parentPublicationId;
    private List<String> keywords;
}
