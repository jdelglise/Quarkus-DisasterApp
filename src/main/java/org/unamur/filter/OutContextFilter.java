package org.unamur.filter;

import java.io.IOException;
import java.text.MessageFormat;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

import org.jboss.logging.MDC;
import org.unamur.Constants;

import io.quarkus.logging.Log;

@Provider
public class OutContextFilter implements ContainerResponseFilter {
    public void filter(ContainerRequestContext req, ContainerResponseContext res)
            throws IOException {
        String correlationId = (String) MDC.get(Constants.CORRELATION_ID_KEY);
        res.getHeaders().add(Constants.CORRELATION_ID_KEY, correlationId);

        Log.info(MessageFormat.format("Response with {0}", res.getStatus()));
        MDC.remove(Constants.CORRELATION_ID_KEY);
        MDC.remove("HttpMethod");
        MDC.remove("Uri");
        MDC.remove("Query");
    }
}