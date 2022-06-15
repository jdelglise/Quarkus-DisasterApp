package org.unamur.resource;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.UsersApi;
import org.unamur.entity.UserEntity;
import org.unamur.mapper.IUserMapper;
import org.unamur.repository.UserRepository;

import io.quarkus.mongodb.panache.PanacheQuery;

public class UsersResource implements UsersApi {

    @Inject
    IUserMapper userMapper;

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jwt;

    @PermitAll
    @Override
    public Response getAllUsers() {
        PanacheQuery<UserEntity> users = userRepository.findAll();
        return Response.ok(
                users.stream()
                        .map(user -> userMapper.toPublicDto(user))
                        .toList())
                .build();
    }

}
