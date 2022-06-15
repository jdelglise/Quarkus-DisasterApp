package org.unamur.resource;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import java.net.URI;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.UserApi;
import org.openapitools.model.UserDto;
import org.openapitools.model.UserPreferenceDto;
import org.unamur.entity.AddressEntity;
import org.unamur.entity.PasswordEntity;
import org.unamur.entity.UserEntity;
import org.unamur.entity.UserPreferencesEntity;
import org.unamur.mapper.IAddressMapper;
import org.unamur.mapper.IPublicationMapper;
import org.unamur.mapper.IUserMapper;
import org.unamur.mapper.IUserPreferencesMapper;
import org.unamur.repository.CategoryRepository;
import org.unamur.repository.PublicationRepository;
import org.unamur.repository.UserRepository;
import org.unamur.util.CryptoUtil;
import org.openapitools.model.AddressDto;

import io.quarkus.logging.Log;

public class UserResource implements UserApi {

    @Inject
    IUserMapper userMapper;

    @Inject
    IUserPreferencesMapper userPreferencesMapper;

    @Inject
    IPublicationMapper publicationMapper;

    @Inject
    UserRepository userRepository;

    @Inject
    PublicationRepository publicationRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    IAddressMapper addressMapper;

    @Inject
    JsonWebToken jwt;

    @PermitAll
    @Override
    public Response getUserPreference() {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        return Response.ok(
            optUserEntityFromToken.get().getPreferences()).build();
    }

    @PermitAll
    @Override
    public Response updateUserPreference(UserPreferenceDto userPreferenceDto) {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserPreferencesEntity preferences = userPreferencesMapper.toEntity(userPreferenceDto);
        optUserEntityFromToken.get().setPreferences(preferences);
        userRepository.update(optUserEntityFromToken.get());
        return Response.status(201).build();

    }

    @PermitAll
    @Override
    public Response getUserById(String id) {
        Optional<UserEntity> optUserEntity = userRepository.findByIdOptional(new ObjectId(id));
        if (optUserEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("User with id {0} not found.", id));
        }
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserDto userResponse = new UserDto();
        if (optUserEntity.get().getId().toString().equals(optUserEntityFromToken.get().getId().toString())) {
            // If user get his own info, can get everything
            // Mapper below populate all fields
            userResponse = userMapper.toDto(optUserEntity.get());
            // Now do the same for the addresses
            List<AddressDto> addressList = new ArrayList<AddressDto>();
            for(AddressEntity addressEntity : optUserEntity.get().getAddressList())
            {
                // map Addresses
                AddressDto addressDto = addressMapper.toDto(addressEntity);
                addressList.add(addressDto);
            }
            userResponse.setAddressList(addressList);
        }
        else{
            // Mapper below populate fields based on user preferences
            userResponse = userMapper.toPublicDto(optUserEntity.get());
            // Now do the same for the addresses
            List<AddressDto> addressList = new ArrayList<AddressDto>();
            if (optUserEntity.get().getPreferences().isPublicAddresses()) {
                for(AddressEntity addressEntity : optUserEntity.get().getAddressList())
                {
                    // map Addresses
                    AddressDto addressDto = addressMapper.toDto(addressEntity);
                    addressList.add(addressDto);
                }
            }
            userResponse.setAddressList(addressList);
        }
        return Response.ok(
            userResponse).build();
    }
  
    @PermitAll
    @Override
    public Response getUser() {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserDto userResponse = new UserDto();
        // Mapper below populate all fields
        userResponse = userMapper.toDto(optUserEntityFromToken.get());
        // Now do the same for the addresses
        List<AddressDto> addressList = new ArrayList<AddressDto>();
        for(AddressEntity addressEntity : optUserEntityFromToken.get().getAddressList())
        {
            // map Addresses
            AddressDto addressDto = addressMapper.toDto(addressEntity);
            addressList.add(addressDto);
        }
        userResponse.setAddressList(addressList);
        return Response.ok(userResponse).build();
    }
  
    @PermitAll
    @Override
    public Response disableUser() {

        Optional<UserEntity> optUserEntity = userRepository.findByLoginOptional(jwt.getSubject());
        if(optUserEntity.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }

        UserEntity userEntity = optUserEntity.get();
        userEntity.setDisabled(true);
        userRepository.persistOrUpdate(userEntity);
        return Response.ok(201).build();
    }
  
   
    @PermitAll
    @Override
    public Response enableAccount() {
        
        Optional<UserEntity> optUserEntity = userRepository.findByLoginOptional(jwt.getSubject());
        if(optUserEntity.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserEntity userEntity = optUserEntity.get();

        userEntity.setDisabled(false);
        userRepository.persistOrUpdate(userEntity);
        return Response.ok(201).build();
    }
  
    @PermitAll
    @Override
    public Response updateUser(@Valid @NotNull UserDto userDto) {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        userMapper.update(optUserEntityFromToken.get(), userDto);
        List<AddressEntity> addressList = new ArrayList<AddressEntity>();
        // Issue : here I don't have the address ID, so almost impossible to do an update
        // Code below generate new addresses based on the input
        // easy solution : only have one address instead of a list
        // less easy soution : add address ID here / remove address from this operation and add dedicated routes
        // or keep it this way, addressId are not used so far :)
        for(AddressDto addressDto : userDto.getAddressList())
        {
            // map Addresses
            AddressEntity addressEntity = addressMapper.toEntity(addressDto);
            addressEntity.setId(new ObjectId());
            addressList.add(addressEntity);
        }
        optUserEntityFromToken.get().setAddressList(addressList);
        userRepository.update(optUserEntityFromToken.get());
        Log.info("User updated :" + optUserEntityFromToken.get().getLogin());
        return Response.created(URI.create("/user/" + optUserEntityFromToken.get().getId())).build();
    }

    @PermitAll
    @Override
    public Response updatePassword(@Valid String body) {
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserEntity userEntity = optUserEntityFromToken.get();
        PasswordEntity passwordEntity = new PasswordEntity();
        // Create new hash and salt
        byte[] salt = CryptoUtil.getSalt();
        passwordEntity.setSalt(salt);
        byte[] hash;
        try {
            hash = CryptoUtil.getHash(body, salt);
            passwordEntity.setHash(hash);
            userEntity.setPassword(passwordEntity);
            userRepository.persistOrUpdate(userEntity);
        } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
        return Response.ok(201).build();
    }

}
