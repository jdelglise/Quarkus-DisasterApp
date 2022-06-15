package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.PublicationDto;
import org.unamur.entity.PublicationEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface IPublicationMapper extends IObjectIdMapper{

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    @Mapping(source = "creator", target = "creator", qualifiedByName = "objectIdToString")
    @Mapping(target = "childPublicationId", ignore = true)
    @Mapping(source = "categoryId", target = "categoryId", qualifiedByName = "objectIdToString")
    @Mapping(target = "customValues", ignore = true) // mapping handled at a different level
    PublicationDto toDto(PublicationEntity publication);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    @Mapping(source = "creator", target = "creator", qualifiedByName = "stringToObjectId")
    @Mapping(target = "childPublicationId", ignore = true)
    @Mapping(source = "categoryId", target = "categoryId", qualifiedByName = "stringToObjectId")
    @Mapping(target = "customValues", ignore = true) // mapping handled at a different level
    PublicationEntity toEntity(PublicationDto publication);
}
