package nl.esciencecenter.rsd.scraper;

import java.util.Collection;

public interface SoftwareInfoRepository {

	Collection<ProgrammingLanguageData> repositoryUrlData();

	Collection<RepositoryUrlData> licenseData();

	Collection<RepositoryUrlData> commitData();

	void save(String data);
}
