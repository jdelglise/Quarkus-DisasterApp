package org.unamur.mapper;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.ConversationDto;
import org.unamur.entity.ConversationEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface IConversationMapper extends IObjectIdMapper {

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    @Mapping(target = "messages", ignore = true) // mapping handled at a different level
    @Mapping(target = "correspondent", ignore = true) // mapping handled at a different level
    @Mapping(target = "creationDate", expression = "java(castToOffsetDateTime(conversation.getCreationDate()))")
    ConversationDto toDto(ConversationEntity conversation);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    @Mapping(target = "messages", ignore = true) // mapping handled at a different level
    @Mapping(target = "sender", ignore = true) // mapping handled at a different level
    @Mapping(target = "receiver", ignore = true) // mapping handled at a different level
    @Mapping(target = "creationDate", expression = "java(castToDate(conversation.getCreationDate()))")
    ConversationEntity toEntity(ConversationDto conversation);

    //the function below to cast date format
    default Date castToDate(OffsetDateTime value) {
        long epochMilli = value.toInstant().toEpochMilli();
        Date date = new Date(epochMilli);
        return date;
     }

    default OffsetDateTime castToOffsetDateTime(Date value) {
        OffsetDateTime offsetDateTime = value.toInstant().atOffset(ZoneOffset.UTC);
        return offsetDateTime;
     }
}