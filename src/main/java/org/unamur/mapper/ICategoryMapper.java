package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.CategoryDto;
import org.unamur.entity.CategoryEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface ICategoryMapper extends IObjectIdMapper{

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    @Mapping(target = "customFields", ignore = true) // mapping handled at a different level
    CategoryDto toDto(CategoryEntity category);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    @Mapping(target = "customFields", ignore = true) // mapping handled at a different level
    CategoryEntity toEntity(CategoryDto category);

}
