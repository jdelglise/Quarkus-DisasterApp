package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

@Data
@MongoEntity(collection = "Password")
public class PasswordEntity {
    private byte[] hash;
    private byte[] salt;
}
