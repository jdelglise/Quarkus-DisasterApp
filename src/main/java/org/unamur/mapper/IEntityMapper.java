package org.unamur.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.EntityDto;
import org.unamur.entity.EntityEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi")
public interface IEntityMapper extends IObjectIdMapper, IBinaryPictureMapper{ //, ILocalDateMapper {

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    @Mapping(target = "addressList", ignore = true) // mapping handled at a different level
    @Mapping(target = "administrator", ignore = true) // id in entity, login in Dto
    @Mapping(source = "picture", target = "picture", qualifiedByName = "binaryPictureToString")
    EntityDto toDto(EntityEntity entity);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    @Mapping(target = "addressList", ignore = true) // mapping handled at a different level
    @Mapping(target = "administratorId", ignore = true) // id in entity, login in Dto
    @Mapping(source = "picture", target = "picture", qualifiedByName = "stringToBinaryPicture")
    EntityEntity toEntity(EntityDto entity);


}