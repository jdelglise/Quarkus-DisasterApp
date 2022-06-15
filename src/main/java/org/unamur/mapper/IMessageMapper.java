package org.unamur.mapper;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.MessageDto;
import org.unamur.entity.MessageEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface IMessageMapper {

    @Mapping(target = "creationDate", expression = "java(castToOffsetDateTime(message.getCreationDate()))")
    MessageDto toDto(MessageEntity message);

    @Mapping(target = "creationDate", expression = "java(castToDate(message.getCreationDate()))")
    MessageEntity toEntity(MessageDto message);

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
