package nl.esciencecenter.rsd.authentication;

import java.util.UUID;

public record OpenIdInfo(UUID sub, String name, String email, String organisation) {
}
