package org.unamur.resource;

import io.quarkus.logging.Log;
import io.quarkus.mongodb.panache.PanacheQuery;

import org.bson.types.ObjectId;
import org.openapitools.api.AdminApi;
import org.openapitools.model.AddressDto;
import org.openapitools.model.CategoryDto;
import org.openapitools.model.CustomFormFieldDto;
import org.openapitools.model.UserDto;
import org.unamur.UserRoles;
import org.unamur.entity.AddressEntity;
import org.unamur.entity.CategoryEntity;
import org.unamur.entity.CustomFormFieldEntity;
import org.unamur.entity.EntityEntity;
import org.unamur.entity.PasswordEntity;
import org.unamur.entity.PublicationEntity;
import org.unamur.entity.UserEntity;
import org.unamur.mapper.IAddressMapper;
import org.unamur.mapper.ICategoryMapper;
import org.unamur.mapper.ICustomFormFieldMapper;
import org.unamur.mapper.IEntityMapper;
import org.unamur.mapper.IUserMapper;
import org.unamur.repository.CategoryRepository;
import org.unamur.repository.EntityRepository;
import org.unamur.repository.PublicationRepository;
import org.unamur.repository.UserRepository;
import org.unamur.util.CryptoUtil;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;

import java.net.URI;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class AdminResource implements AdminApi {

    @Inject
    IEntityMapper entityMapper;

    @Inject
    EntityRepository entityRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    IAddressMapper addressMapper;

    @Inject
    IUserMapper userMapper;

    @Inject
    ICategoryMapper categoryMapper;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    PublicationRepository publicationRepository;

    @Inject
    ICustomFormFieldMapper customFormFieldMapper;

    @Override
    @RolesAllowed(UserRoles.ADMIN)
    public Response getEntitiesUnvalidated() {
        PanacheQuery<EntityEntity> entities = entityRepository.find("validated", false);
        return Response.ok(
                entities.stream()
                        .map(entity -> entityMapper.toDto(entity))
                        .toList())
                .build();
    }

    @Override
    @RolesAllowed(UserRoles.ADMIN)
    public Response validateEntity(String id) {
        Optional<EntityEntity> optEntityEntity = entityRepository.findByIdOptional(new ObjectId(id));
        if (optEntityEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Entity with id {0} not found.", id));
        }
        EntityEntity entityEntity = entityRepository.findById(new ObjectId(id));
        entityEntity.setValidated(true);
        entityRepository.update(entityEntity);
        Log.info("Entity" + entityEntity.getName() + "validated");
        return Response.noContent().build();
    }

    @RolesAllowed(UserRoles.ADMIN)
    @Override
    public Response disableUserAdmin(String id) {

        Optional<UserEntity> optUserEntity = userRepository.findByIdOptional(new ObjectId(id));
        if (optUserEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("User with id {0} not found.", id));
        }

        UserEntity userEntity = optUserEntity.get();
        userEntity.setDisabled(true);
        return Response.ok(201).build();
    }

    @RolesAllowed(UserRoles.ADMIN)
    @Override
    public Response enableUserAdmin(String id) {

        Optional<UserEntity> optUserEntity = userRepository.findByIdOptional(new ObjectId(id));
        if (optUserEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("User with id {0} not found.", id));
        }
        UserEntity userEntity = optUserEntity.get();
        userEntity.setDisabled(false);
        userRepository.persistOrUpdate(userEntity);
        return Response.ok(201).build();
    }

    @RolesAllowed(UserRoles.ADMIN)
    @Override
    public Response getUnvalidatedUsers() {

        List<UserEntity> unvalidatedUsers = userRepository.list("validated", false);

        return Response.ok(
                unvalidatedUsers.stream()
                        .map(user -> {
                            UserDto userResponse = userMapper.toDto(user);
                            // Now do the same for the addresses
                            List<AddressDto> addressList = new ArrayList<>();
                            for (AddressEntity addressEntity : user.getAddressList()) {
                                // map Addresses
                                AddressDto addressDto = addressMapper.toDto(addressEntity);
                                addressList.add(addressDto);
                            }
                            userResponse.setAddressList(addressList);
                            return userResponse;
                        }))
                .build();
    }

    @RolesAllowed(UserRoles.ADMIN)
    @Override
    public Response updatePasswordAdmin(String login, String body) {
        Optional<UserEntity> optUserEntity = userRepository.findByLoginOptional(login);
        if (optUserEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("User with id {0} not found.", login));
        }
        UserEntity userEntity = optUserEntity.get();
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
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            return Response.serverError().build();
        }
        return Response.ok(201).build();
    }

    @Override
    @RolesAllowed(UserRoles.ADMIN)
    public Response validateUser(String id) {

        Optional<UserEntity> optUserEntity = userRepository.findByIdOptional(new ObjectId(id));
        if (optUserEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("User with id {0} not found.", id));
        }

        UserEntity userEntity = optUserEntity.get();
        userEntity.setValidated(true);
        userRepository.persistOrUpdate(userEntity);

        return Response.ok(201).build();
    }

    @Override
    @RolesAllowed(UserRoles.ADMIN)
    public Response assignAdminRole(String id) {

        Optional<UserEntity> optUserEntity = userRepository.findByIdOptional(new ObjectId(id));
        if (optUserEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("User with id {0} not found.", id));
        }

        UserEntity userEntity = optUserEntity.get();
        userEntity.setRole(UserRoles.ADMIN);
        userRepository.persistOrUpdate(userEntity);
        return Response.ok(201).build();
    }

    @Override
    @RolesAllowed(UserRoles.ADMIN)
    public Response createCategory(@Valid @NotNull CategoryDto categoryDto) {

        CategoryEntity categoryEntity = categoryMapper.toEntity(categoryDto);
        Optional<CategoryEntity> category = categoryRepository.findByNameAndTypeOptional(categoryEntity.getName(),
                categoryEntity.getType().name());
        if (category.isPresent()) {
            Log.warn("Someone tried to create an existing category :" + category.get().getName()
                    + " for category type : " + categoryDto.getType().value());
            return Response.status(409).build();
        }
        categoryEntity.setId(new ObjectId());
        categoryEntity.setCreationDate(new Date());

        List<CustomFormFieldEntity> customFormFieldEntityList = new ArrayList<CustomFormFieldEntity>();
        for(CustomFormFieldDto customFormFieldDto : categoryDto.getCustomFields())
        {
            // map custom fields
            CustomFormFieldEntity customFormFieldEntity = customFormFieldMapper.toEntity(customFormFieldDto);
            customFormFieldEntityList.add(customFormFieldEntity);
        }
        categoryEntity.setCustomFields(customFormFieldEntityList);

        categoryRepository.persist(categoryEntity);
        Log.info("New category created :" + categoryEntity.getName());
        return Response.created(URI.create("/category/" + categoryEntity.getId())).build();
    }

    @Override
    @RolesAllowed(UserRoles.ADMIN)
    public Response modifyCategory(@Valid @NotNull CategoryDto categoryDto) {

        CategoryEntity categoryEntity = categoryMapper.toEntity(categoryDto);
        Optional<CategoryEntity> category = categoryRepository.findByNameAndTypeOptional(categoryEntity.getName(),
                categoryEntity.getType().name());
        if (!category.isPresent()) {
            Log.warn("The category " + categoryDto.getName() + " doesn't exist for category type : "
                    + categoryDto.getType().value());
            return Response.status(409).build();
        }
        categoryEntity.setId(new ObjectId());
        categoryEntity.setCreationDate(new Date());

        categoryRepository.persist(categoryEntity);
        Log.info("Category modified - New category created :" + categoryEntity.getName());
        return Response.created(URI.create("/category/" + categoryEntity.getId())).build();
    }

    @RolesAllowed(UserRoles.ADMIN)
    @Override
    public Response disableCategory(String id) {

        // check if there is a category identified by id        
        Optional<CategoryEntity> optCategory = categoryRepository.findByIdOptional(new ObjectId(id));
        if (optCategory.isEmpty()) {
            Log.warn("The category doesn't exist for category type.");
            return Response.status(404).build();
        }
        CategoryEntity category = optCategory.get();

        // find all publications related to this category
        List<PublicationEntity> publicationsList = publicationRepository.list("categoryId", category.getId());
        Log.info("Checking size = " + publicationsList.size());
        if (!publicationsList.isEmpty()) {
            // Close all the publications related to this category
            for (PublicationEntity publicationEntity : publicationsList) {
                publicationEntity.setClosed(true);
                publicationRepository.update(publicationEntity);
            }
        }
        category.setDisabled(true);
        categoryRepository.update(category);

        return Response.ok(200).build();
    }

    @RolesAllowed(UserRoles.ADMIN)
    @Override
    public Response reactivateCategory(String id) {

        // check if there is a category identified by id
        Optional<CategoryEntity> optCategory = categoryRepository.findByIdOptional(new ObjectId(id));
        if (optCategory.isEmpty()) {
            Log.warn("The category doesn't exist for category type.");
            return Response.status(404).build();
        }
        CategoryEntity category = optCategory.get();

        // find all publications related to this category
        List<PublicationEntity> publicationsList = publicationRepository.list("categoryId", category.getId());
        Log.info("Checking size = " + publicationsList.size());
        if (!publicationsList.isEmpty()) {
            // Close all the publications related to this category
            for (PublicationEntity publicationEntity : publicationsList) {
                publicationEntity.setClosed(false);
                publicationRepository.update(publicationEntity);
            }
        }
        category.setDisabled(false);
        categoryRepository.update(category);

        return Response.ok(200).build();
    }
}
