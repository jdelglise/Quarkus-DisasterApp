package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.openapitools.model.CustomFieldValueDto;
import org.unamur.entity.CustomFieldValueEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface ICustomFieldValueMapper {

    CustomFieldValueDto toDto(CustomFieldValueEntity customFieldValue);

    CustomFieldValueEntity toEntity(CustomFieldValueDto customFieldValue);
}
