package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.AddressDto;
import org.unamur.entity.AddressEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface IAddressMapper extends IObjectIdMapper {

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    AddressDto toDto(AddressEntity user);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    AddressEntity toEntity(AddressDto user);
}
