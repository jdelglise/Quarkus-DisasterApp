package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.UserPreferenceDto;
import org.unamur.entity.UserPreferencesEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface IUserPreferencesMapper extends IObjectIdMapper{

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    UserPreferenceDto toDto(UserPreferencesEntity userPreferences);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    UserPreferencesEntity toEntity(UserPreferenceDto userPreferences);
}
