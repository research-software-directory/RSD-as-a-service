package nl.esciencecenter.rsd.scraper;

import java.util.Collection;

public interface SoftwareInfoRepository {

	enum codePlatformProvider {
		github, gitlab, bitbucket, other
	}

	Collection<RepositoryUrlData> languagesData();

	Collection<RepositoryUrlData> licenseData();

	Collection<RepositoryUrlData> commitData();

	void save(Collection<RepositoryUrlData> data);
}
