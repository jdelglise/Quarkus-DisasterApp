package org.unamur.entity;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

@Data
@MongoEntity(collection = "Conversation")
public class ConversationEntity {
    private ObjectId id; // used by MongoDB for the _id field
    private String sender;
    private String receiver;
    private List<MessageEntity> messages;
    private Date creationDate;
}
