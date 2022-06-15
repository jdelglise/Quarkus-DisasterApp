package org.unamur.resource;

import io.quarkus.logging.Log;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.PublicationApi;
import org.openapitools.model.CustomFieldValueDto;
import org.openapitools.model.PublicationDto;
import org.unamur.Constants;
import org.unamur.entity.CategoryEntity;
import org.unamur.entity.CustomFieldValueEntity;
import org.unamur.entity.CustomFormFieldEntity;
import org.unamur.entity.PublicationEntity;
import org.unamur.entity.UserEntity;
import org.unamur.mapper.ICustomFieldValueMapper;
import org.unamur.mapper.IPublicationMapper;
import org.unamur.repository.CategoryRepository;
import org.unamur.repository.PublicationRepository;
import org.unamur.repository.UserRepository;

import javax.annotation.security.PermitAll;
import javax.validation.UnexpectedTypeException;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class PublicationResource implements PublicationApi {

    @Inject
    IPublicationMapper publicationMapper;

    @Inject
    PublicationRepository publicationRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    ICustomFieldValueMapper customFieldValueMapper;

    @Inject
    JsonWebToken jwt;    

    @Override
    @PermitAll
    public Response getRelatedPublications(String id){
        Optional<PublicationEntity> optPublicationEntity = publicationRepository.findByIdOptional(new ObjectId(id));
        if (optPublicationEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Publication with id {0} not found.", id));
        }
        List<PublicationEntity> publicationList = publicationRepository.findRelatedPublications(optPublicationEntity.get());
        List<PublicationDto> publicationDtoList = new ArrayList<>();
        for(PublicationEntity publicationEntity : publicationList)
        {
            // map matching publication
            PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
            publicationDto = mapCustomFieldsToDTO(publicationEntity, publicationDto);
            publicationDtoList.add(publicationDto);
        }
        return Response.ok(publicationDtoList).build();
    }

    @PermitAll
    @Override
    public Response getPublication(String id) {

        // check if the id publication is available
        Optional<PublicationEntity> optPublicationEntity = publicationRepository.findByIdOptional(new ObjectId(id));
        if (optPublicationEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Publication with id {0} not found.", id));
        }
        PublicationEntity publicationEntity = optPublicationEntity.get();        
        PublicationDto publicationResponse = publicationMapper.toDto(publicationEntity);
        publicationResponse = mapCustomFieldsToDTO(publicationEntity, publicationResponse);
        return Response.ok(publicationResponse).build();
    }

    @PermitAll
    @Override
    public Response createPublication(@Valid @NotNull PublicationDto publicationDto) {
        
        PublicationEntity publicationEntity = publicationMapper.toEntity(publicationDto);

        //search for connected user
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }

        // set fields that are not in input params
        publicationEntity.setId(new ObjectId());
        publicationEntity.setCreator(optUserEntityFromToken.get().getId());
        publicationEntity.setCreationDate(new Date());
        publicationEntity.setLastUpdateDate(new Date());

        // check category id
        Optional<CategoryEntity> categoryEntity = categoryRepository.findByIdOptional(new ObjectId(publicationDto.getCategoryId())); 
        if (categoryEntity.isEmpty()) {
            Log.warn("Unknown category id " + publicationDto.getCategoryId() + " received during publication creation");
            throw new NotFoundException("Cannot find category related to the provided id");
        }

        //map and validate customFieldsValues
        publicationEntity = mapCustomFieldsToEntity(publicationDto, publicationEntity);

        publicationRepository.persist(publicationEntity);
        Log.info("New publication created: " + publicationEntity.getTitle());
        return Response.created(URI.create("/publication/" + publicationEntity.getId())).build();
    }

    @PermitAll
    @Override
    public Response updatePublication(String id, @Valid @NotNull PublicationDto publicationDto) {

        Optional<PublicationEntity> optPublicationEntity = publicationRepository.findByIdOptional(new ObjectId(id));
        if (optPublicationEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Publication with id {0} not found.", id));
        }
        PublicationEntity publicationEntity = publicationMapper.toEntity(publicationDto);
        publicationEntity.setId(new ObjectId(id));
        publicationEntity.setLastUpdateDate(new Date());
        publicationEntity = mapCustomFieldsToEntity(publicationDto, publicationEntity);
        publicationRepository.update(publicationEntity);
        Log.info("Publication " + publicationEntity.getTitle() + " updated");
        return Response.noContent().build();
    }

    @PermitAll
    @Override
    public Response closePublication(String id) {

        // check if the id publication is available
        Optional<PublicationEntity> optPublicationEntity = publicationRepository.findByIdOptional(new ObjectId(id));
        if (optPublicationEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Publication with id {0} not found.", id));
        }
        PublicationEntity publicationEntity = optPublicationEntity.get();

        //search for connected user
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserEntity userEntity = optUserEntityFromToken.get(); 

        // check if the user is the publication creator
        if( ! userEntity.getId().equals(publicationEntity.getCreator())){
            Log.warn("The User is not the publication creator.");
            throw new NotFoundException("The User is not the publication creator.");
        }
        
        publicationEntity.setClosed(true);
        publicationEntity.setLastUpdateDate(new Date());
        publicationRepository.update(publicationEntity);
        Log.info("Publication " + publicationEntity.getTitle() + " closed.");
        return Response.ok(200).build();
    }

    @PermitAll
    @Override
    public Response reactivatePublication(String id) {

        // check if the id publication is available
        Optional<PublicationEntity> optPublicationEntity = publicationRepository.findByIdOptional(new ObjectId(id));
        if (optPublicationEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Publication with id {0} not found.", id));
        }
        PublicationEntity publicationEntity = optPublicationEntity.get();

        //search for connected user
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }
        UserEntity userEntity = optUserEntityFromToken.get(); 

        // check if the user is the publication creator
        if(! userEntity.getId().equals(publicationEntity.getCreator())){
            Log.warn("The User is not the publication creator.");
            throw new NotFoundException("The User is not the publication creator.");
        }
        
        publicationEntity.setClosed(false);
        publicationEntity.setLastUpdateDate(new Date());
        publicationRepository.update(publicationEntity);
        Log.info("Publication " + publicationEntity.getTitle() + " reactivated.");
        return Response.ok(200).build();
    } 


    public PublicationDto mapCustomFieldsToDTO(PublicationEntity publication, PublicationDto publicationResponse)
    {
        //no validation needed to retrieve information from DB, just a basic mapping
        List<CustomFieldValueDto> customFieldValueList = new ArrayList<CustomFieldValueDto>();
        for(CustomFieldValueEntity customFieldValueEntity : publication.getCustomValues())
        {
            // map custom fields
            CustomFieldValueDto customFieldValueDto = customFieldValueMapper.toDto(customFieldValueEntity);
            customFieldValueList.add(customFieldValueDto);
        }
        publicationResponse.setCustomValues(customFieldValueList);
        return publicationResponse;
    }

    public PublicationEntity mapCustomFieldsToEntity(PublicationDto publication, PublicationEntity publicationResponse)
    {
        List<CustomFieldValueEntity> customFieldValueList = new ArrayList<CustomFieldValueEntity>();
        // category will be needed to validate the custom fields
        Optional<CategoryEntity> optCategoryEntity = categoryRepository.findByIdOptional(new ObjectId(publication.getCategoryId()));
        if (optCategoryEntity.isEmpty()) {
            Log.warn("Cannot find the category for id provided : " + publication.getCategoryId());
            throw new NotFoundException("Cannot find the category for id provided");
        }
        for(CustomFieldValueDto customFieldValueDto : publication.getCustomValues())
        {   
            // Check first if the custom values match the customFields from the category
            boolean valid = false;
            for (CustomFormFieldEntity customFormFieldEntity :  optCategoryEntity.get().getCustomFields())
            {
                if (customFormFieldEntity.getName().equals(customFieldValueDto.getName())){
                    valid = true;
                    break;
                }
            }
            if (! valid) {
                Log.error("Name provided for custom values doesn't match the custom fields from the category");
                throw new UnexpectedTypeException();
            }
            else {
                // map custom fields
                CustomFieldValueEntity customFieldValueEntity = customFieldValueMapper.toEntity(customFieldValueDto);
                customFieldValueList.add(customFieldValueEntity);
            }
        }
        publicationResponse.setCustomValues(customFieldValueList);
        return publicationResponse;
    }

    @Override
    @PermitAll
    public Response getMyPublications() {
        //search for connected user
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }

        List<PublicationEntity> publicationEntityList = publicationRepository.findByCreator(optUserEntityFromToken.get().getId());
        List<PublicationDto> response = new ArrayList<PublicationDto>();
        for (PublicationEntity publicationEntity : publicationEntityList) {
            if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
                publicationDto = mapCustomFieldsToDTO(publicationEntity, publicationDto);
                response.add(publicationDto);
            }
        }
        return Response.ok(response).build();
    }

    @Override
    @PermitAll
    public Response getMyOffers() {
        //search for connected user
        Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
        if (optUserEntityFromToken.isEmpty()) {
            Log.warn("Cannot find user related to the provided token.");
            throw new NotFoundException("Cannot find user related to this token");
        }

        List<PublicationEntity> publicationEntityList = publicationRepository.findByCreator(optUserEntityFromToken.get().getId());
        List<PublicationDto> response = new ArrayList<PublicationDto>();
        for (PublicationEntity publicationEntity : publicationEntityList) {
            if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
                publicationDto = mapCustomFieldsToDTO(publicationEntity, publicationDto);
                Optional<CategoryEntity> category = categoryRepository.findByIdOptional(publicationEntity.getCategoryId());
                if (category.isEmpty()) {
                    Log.warn("Cannot find category with id " + publicationEntity.getCategoryId() + " for publication " + publicationEntity.getId());
                    throw new NotFoundException("Cannot find category related to this publication");
                }
                if (category.get().getType().equals(Constants.CategoryType.OFFERS)) {
                    response.add(publicationDto);
                }
            }
        }
        return Response.ok(response).build();
    }

    @Override
    @PermitAll
    public Response getMyRequests() {
       //search for connected user
       Optional<UserEntity> optUserEntityFromToken = userRepository.findByLoginOptional(jwt.getSubject());
       if (optUserEntityFromToken.isEmpty()) {
           Log.warn("Cannot find user related to the provided token.");
           throw new NotFoundException("Cannot find user related to this token");
       }
       
       List<PublicationEntity> publicationEntityList = publicationRepository.findByCreator(optUserEntityFromToken.get().getId());
       List<PublicationDto> response = new ArrayList<PublicationDto>();
       for (PublicationEntity publicationEntity : publicationEntityList) {
            if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
                publicationDto = mapCustomFieldsToDTO(publicationEntity, publicationDto);
                Optional<CategoryEntity> category = categoryRepository.findByIdOptional(publicationEntity.getCategoryId());
                if (category.isEmpty()) {
                    Log.warn("Cannot find category with id " + publicationEntity.getCategoryId() + " for publication " + publicationEntity.getId());
                    throw new NotFoundException("Cannot find category related to this publication");
                }
                if (category.get().getType().equals(Constants.CategoryType.REQUESTS)) {
                    response.add(publicationDto);
                }
            }
       }
       return Response.ok(response).build();
    }


}