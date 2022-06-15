package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

@Data
@MongoEntity(collection = "CustomFormField")
public class CustomFormFieldEntity {
    private String initalValue;
    private String label;
    private String name;
    private boolean required;
}