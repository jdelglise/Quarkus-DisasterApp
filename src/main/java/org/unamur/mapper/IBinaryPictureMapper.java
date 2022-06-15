package org.unamur.mapper;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.mapstruct.Named;

public interface IBinaryPictureMapper {
    @Named("binaryPictureToString")
    public static String binaryPictureToString(Binary binary) {
        if (binary== null) {
            return null;
        }
        return new String(Base64.getEncoder().encode(binary.getData()));
    }

    @Named("stringToBinaryPicture")
    public static Binary stringToBinaryPicture(String picture) {
        if (picture== null) {
            return null;
        }
        return new Binary(BsonBinarySubType.BINARY, Base64.getDecoder().decode(picture.getBytes(StandardCharsets.UTF_8)));
    }
}
