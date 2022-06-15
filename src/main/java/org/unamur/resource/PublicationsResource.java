package org.unamur.resource;

import io.quarkus.logging.Log;
import io.quarkus.mongodb.panache.PanacheQuery;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.PublicationsApi;
import org.openapitools.model.PublicationDto;
import org.unamur.Constants;
import org.unamur.entity.CategoryEntity;
import org.unamur.entity.PublicationEntity;
import org.unamur.mapper.ICustomFieldValueMapper;
import org.unamur.mapper.IPublicationMapper;
import org.unamur.repository.CategoryRepository;
import org.unamur.repository.PublicationRepository;
import org.unamur.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;


public class PublicationsResource implements PublicationsApi {

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
    public Response getAllPublications() {
        PanacheQuery<PublicationEntity> publications = publicationRepository.findAll();

        return Response.ok(
                        publications.stream()
                                .map(publication -> publicationMapper.toDto(publication))
                                .toList())
                .build();
    }

    @Override
    public Response getAllOffers() {
       List<PublicationEntity> publicationEntityList = publicationRepository.findAll().list();
       List<PublicationDto> response = new ArrayList<PublicationDto>();
       for (PublicationEntity publicationEntity : publicationEntityList) {
            if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
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
    public Response getOffersBycategory(String id) {
       List<PublicationEntity> publicationEntityList = publicationRepository.findByCategory(new ObjectId(id));
       List<PublicationDto> response = new ArrayList<PublicationDto>();
       for (PublicationEntity publicationEntity : publicationEntityList) {
            if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
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
    public Response getAllRequests() {
       List<PublicationEntity> publicationEntityList = publicationRepository.findAll().list();
       List<PublicationDto> response = new ArrayList<PublicationDto>();
       for (PublicationEntity publicationEntity : publicationEntityList) {
        if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
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

    @Override
    public Response getRequestsBycategory(String id) {
       List<PublicationEntity> publicationEntityList = publicationRepository.findByCategory(new ObjectId(id));
       List<PublicationDto> response = new ArrayList<PublicationDto>();
       for (PublicationEntity publicationEntity : publicationEntityList) {
        if (! publicationEntity.isClosed() ) {
                PublicationDto publicationDto = publicationMapper.toDto(publicationEntity);
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