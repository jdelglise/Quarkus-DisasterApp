package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;

import java.util.Date;

@Data
@MongoEntity(collection = "Message")
public class MessageEntity {
    private String sender;
    private Date creationDate;
    private String message;
    private boolean read;
}
