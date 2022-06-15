package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.openapitools.model.CustomFormFieldDto;
import org.unamur.entity.CustomFormFieldEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface ICustomFormFieldMapper {

    CustomFormFieldDto toDto(CustomFormFieldEntity customFormField);

    CustomFormFieldEntity toEntity(CustomFormFieldDto customFormField);
}
