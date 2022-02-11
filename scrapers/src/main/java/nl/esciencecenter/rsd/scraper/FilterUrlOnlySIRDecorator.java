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
	public Collection<RepositoryUrlData> languagesData() {
		Collection<RepositoryUrlData> data = origin.languagesData();
		return data.stream()
				.filter(repositoryUrlData -> repositoryUrlData.url().startsWith(urlFilter))
				.toList();
	}

	@Override
	public Collection<RepositoryUrlData> licenseData() {
		Collection<RepositoryUrlData> data = origin.licenseData();
		return data.stream()
				.filter(repositoryUrlData -> repositoryUrlData.url().startsWith(urlFilter))
				.toList();
	}

	@Override
	public Collection<RepositoryUrlData> commitData() {
		Collection<RepositoryUrlData> data = origin.commitData();
		return data.stream()
				.filter(repositoryUrlData -> repositoryUrlData.url().startsWith(urlFilter))
				.toList();
	}

	@Override
	public void save(Collection<RepositoryUrlData> data) {
		origin.save(data);
	}
}
