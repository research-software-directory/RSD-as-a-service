package nl.esciencecenter.rsd.authentication;

public record OpenIdInfo(String sub, String name, String email, String organisation) {
}
