package org.unamur.mapper;

import org.bson.types.ObjectId;
import org.mapstruct.Named;

public interface IObjectIdMapper {
    @Named("objectIdToString")
    public static String objectIdToString(ObjectId oid) {
        if (oid == null) {
            return null;
        }
        return oid.toString();
    }

    @Named("stringToObjectId")
    public static ObjectId stringToObjectId(String oid) {
        if (oid == null) {
            return null;
        }
        return new ObjectId(oid);
    }
}
