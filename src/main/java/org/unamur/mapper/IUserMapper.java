package org.unamur.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.openapitools.model.UserDto;
import org.unamur.entity.UserEntity;

/**
 * https://mapstruct.org/news/2019-12-06-mapstruct-and-quarkus/
 */

@Mapper(componentModel = "cdi") //, uses = IAddressMapper.class)
public interface IUserMapper extends IObjectIdMapper {

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "addressList", ignore = true) // mapping handled at a different level
    UserDto toDto(UserEntity user);

    @Mapping(source = "id", target = "id", qualifiedByName = "stringToObjectId")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "addressList", ignore = true) // mapping handled at a different level
    UserEntity toEntity(UserDto user);

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToString")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "firstName", expression = "java(getPublicString(user.getFirstName(), user.getPreferences().isPublicFirstName()))")
    @Mapping(target = "lastName", expression = "java(getPublicString(user.getLastName(), user.getPreferences().isPublicLastName()))")
    @Mapping(target = "email", expression = "java(getPublicString(user.getEmail(), user.getPreferences().isPublicEmail()))")
    @Mapping(target = "birthdate", expression = "java(getPublicDate(user.getBirthdate(), user.getPreferences().isPublicBirthdate()))") 
    @Mapping(target = "addressList", ignore = true) // mapping handled at a different level
    @Mapping(target = "phoneNumber", expression = "java(getPublicString(user.getPhoneNumber(), user.getPreferences().isPublicPhoneNumber()))")
    UserDto toPublicDto(UserEntity user); //the goal of this function is to return what other user can see


    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "addressList", ignore = true) // mapping handled at a different level
    void update(@MappingTarget UserEntity user, UserDto updateUser);

    //the function below is used to return null for fields defined as private field in user preferences
    default String getPublicString(String value, boolean isPublic) {
        if (!isPublic){
            return null;
        }
        else{
            return value;
        }
     }

    //the function below is used to return null for fields defined as private field in user preferences
    default LocalDate getPublicDate(Date value, boolean isPublic) {
        if (!isPublic){
            return null;
        }
        else{
            return Instant.ofEpochMilli(value.getTime())
      .atZone(ZoneId.systemDefault())
      .toLocalDate();
        }
     }
}
