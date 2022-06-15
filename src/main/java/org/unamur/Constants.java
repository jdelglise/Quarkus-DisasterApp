package org.unamur;

public class Constants {
    private Constants() {
    }

    public enum CategoryType {
        OFFERS,
        REQUESTS
    }

    // This values modify the name of the correlation id you can find in the header
    public static final String CORRELATION_ID_KEY = "Correlation-Id";
}
