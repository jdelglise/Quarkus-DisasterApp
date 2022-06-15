package org.unamur.entity;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

@Data
@MongoEntity(collection = "UserPreferences")
public class UserPreferencesEntity {
    private ObjectId id; // used by MongoDB for the _id field
    private boolean publicBirthdate;
    private boolean publicEmail;
    private boolean publicLastName;
    private boolean publicFirstName;
    private boolean publicPhoneNumber;
    private boolean publicAddresses;
}
