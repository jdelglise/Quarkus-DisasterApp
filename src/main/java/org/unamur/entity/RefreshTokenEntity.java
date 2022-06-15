package org.unamur.entity;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

@Data
@MongoEntity(collection = "RefreshToken")
public class RefreshTokenEntity {
    private ObjectId id;
    private String token;
}
