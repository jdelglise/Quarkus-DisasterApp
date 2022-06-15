package org.unamur.service;

import java.util.Map;

public interface IJWTService {

    public String generateAccessToken(String subject);

    public String generateAccessToken(String subject, Map<String, Object> claims);

    public String generateRefreshToken(String subject);

    public String generateRefreshToken(String subject, Map<String, Object> claims);
}
