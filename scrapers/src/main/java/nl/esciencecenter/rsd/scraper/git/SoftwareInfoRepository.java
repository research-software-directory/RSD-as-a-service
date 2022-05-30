package nl.esciencecenter.rsd.scraper.git;

import java.util.Collection;

public interface SoftwareInfoRepository {

	Collection<RepositoryUrlData> languagesData(int limit);

	Collection<RepositoryUrlData> licenseData(int limit);

	Collection<RepositoryUrlData> commitData(int limit);

	void save(Collection<RepositoryUrlData> data);
}
