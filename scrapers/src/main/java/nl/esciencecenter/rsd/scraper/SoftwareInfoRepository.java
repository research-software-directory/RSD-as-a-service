package nl.esciencecenter.rsd.scraper;

import java.util.Collection;

public interface SoftwareInfoRepository {

	Collection<RepositoryUrlData> data();

	Collection<LicenseData> licenseData();

	void save(String data);
}
