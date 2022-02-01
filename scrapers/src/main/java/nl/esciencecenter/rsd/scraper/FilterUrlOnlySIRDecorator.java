package nl.esciencecenter.rsd.scraper;

import java.util.Collection;
import java.util.Objects;

public class FilterUrlOnlySIRDecorator implements SoftwareInfoRepository {

	private final SoftwareInfoRepository origin;
	private final String urlFilter;

	public FilterUrlOnlySIRDecorator(SoftwareInfoRepository origin, String urlFilter) {
		this.origin = Objects.requireNonNull(origin);
		this.urlFilter = Objects.requireNonNull(urlFilter);
	}

	@Override
	public Collection<RepositoryUrlData> data() {
		Collection<RepositoryUrlData> data = origin.data();
		return data.stream()
				.filter(repositoryUrlData -> repositoryUrlData.url().startsWith(urlFilter))
				.toList();
	}

	@Override
	public Collection<LicenseData> licenseData() {
		Collection<LicenseData> data = origin.licenseData();
		return data.stream()
				.filter(repositoryUrlData -> repositoryUrlData.url().startsWith(urlFilter))
				.toList();
	}

	@Override
	public void save(String data) {
		origin.save(data);
	}
}
