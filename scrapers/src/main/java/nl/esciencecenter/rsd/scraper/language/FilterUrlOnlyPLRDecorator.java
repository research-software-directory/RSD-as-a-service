package nl.esciencecenter.rsd.scraper.language;

import java.util.Collection;
import java.util.Objects;

public class FilterUrlOnlyPLRDecorator implements ProgrammingLanguagesRepository {

	private final ProgrammingLanguagesRepository origin;
	private final String urlFilter;

	public FilterUrlOnlyPLRDecorator(ProgrammingLanguagesRepository origin, String urlFilter) {
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
