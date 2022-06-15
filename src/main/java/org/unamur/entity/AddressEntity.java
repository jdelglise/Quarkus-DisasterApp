package org.unamur.entity;


import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@MongoEntity(collection = "Address")
public class AddressEntity {
    private ObjectId id;
    private String street;
    private String number;
    private String city;
    private String postCode;
    private String country;
}
