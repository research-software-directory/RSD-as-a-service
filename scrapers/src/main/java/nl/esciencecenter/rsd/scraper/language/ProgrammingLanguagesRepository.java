package nl.esciencecenter.rsd.scraper.language;

import java.util.Collection;

public interface ProgrammingLanguagesRepository {

	Collection<RepositoryUrlData> data();

	Collection<LicenseData> licenseData();

	void save(String data);
}
