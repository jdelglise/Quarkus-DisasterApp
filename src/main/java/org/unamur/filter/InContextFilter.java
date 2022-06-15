package org.unamur.filter;

import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;

import org.jboss.logging.MDC;
import org.unamur.Constants;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.UUID;
import io.quarkus.logging.Log;

import javax.ws.rs.container.ContainerRequestContext;

@Provider
public class InContextFilter implements ContainerRequestFilter {
    @Context
    SecurityContext securityCtx;

    public void filter(ContainerRequestContext ctx) throws IOException {
        String correlationId = ctx.getHeaderString(Constants.CORRELATION_ID_KEY);
        if (correlationId == null)
            correlationId = UUID.randomUUID().toString();

        MDC.put(Constants.CORRELATION_ID_KEY, correlationId);

        if (securityCtx.getUserPrincipal() != null && securityCtx.getUserPrincipal().getName() != null) {
            MDC.put("User", securityCtx.getUserPrincipal().getName());
        } else {
            MDC.put("User", "Anonymous");
        }

        MDC.put("HttpMethod", ctx.getMethod());
        MDC.put("Uri", ctx.getUriInfo().getPath());
        MDC.put("Query", ctx.getUriInfo().getQueryParameters());
        Log.info(MessageFormat.format("{0} {1} {2}", ctx.getMethod(), ctx.getUriInfo().getPath(),
                ctx.getUriInfo().getQueryParameters()));

    }
}
