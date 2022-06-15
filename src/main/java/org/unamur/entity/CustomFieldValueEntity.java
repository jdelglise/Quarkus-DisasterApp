package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

@Data
@MongoEntity(collection = "CustomFieldValue")
public class CustomFieldValueEntity {
    private String name;
    private String value;
}