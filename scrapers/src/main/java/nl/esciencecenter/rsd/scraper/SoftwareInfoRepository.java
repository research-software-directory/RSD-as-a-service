package nl.esciencecenter.rsd.scraper;

import java.util.Collection;

public interface SoftwareInfoRepository {

	enum CodePlatformProvider {
		GITHUB, GITLAB, BITBUCKET, OTHER
	}

	Collection<RepositoryUrlData> languagesData();

	Collection<RepositoryUrlData> licenseData();

	Collection<RepositoryUrlData> commitData();

	void save(Collection<RepositoryUrlData> data);
}
