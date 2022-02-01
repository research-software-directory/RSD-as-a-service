package nl.esciencecenter.rsd.scraper;

import java.util.Collection;

public interface SoftwareInfoRepository {

	Collection<RepositoryUrlData> repositoryUrldata();

	Collection<LicenseData> licenseData();

	void save(String data);
}
