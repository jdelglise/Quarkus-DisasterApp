package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;
import org.bson.types.ObjectId;
import org.bson.types.Binary;

import java.util.List;


@Data
@MongoEntity(collection = "Entity")
public class EntityEntity {
    private ObjectId id; // used by MongoDB for the _id field
    private String name;
    private String email;
    private String phoneNumber;
    private boolean validated;
    private List<AddressEntity> addressList;
    private ObjectId administratorId;
    private Binary picture;
}
