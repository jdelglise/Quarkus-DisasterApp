package org.unamur.entity;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

@Data
@MongoEntity(collection = "User")
public class UserEntity {
    private ObjectId id; // used by MongoDB for the _id field
    private PasswordEntity password;
    private String firstName;
    private String lastName;
    private String login;
    private String email;
    private String phoneNumber;
    private Date birthdate;
    private boolean validated;
    private boolean disabled;
    private Date lastConnection;
    private List<AddressEntity> addressList;
    private String role;
    private UserPreferencesEntity preferences;
}
