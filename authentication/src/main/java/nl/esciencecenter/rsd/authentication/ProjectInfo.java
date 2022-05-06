package nl.esciencecenter.rsd.authentication;

import java.util.UUID;

public record ProjectInfo(UUID projectId, String slug) {
}
