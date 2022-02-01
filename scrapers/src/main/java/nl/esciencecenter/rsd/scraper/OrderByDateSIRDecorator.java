package nl.esciencecenter.rsd.scraper;

import java.util.Collection;
import java.util.Comparator;
import java.util.Objects;

public class OrderByDateSIRDecorator implements SoftwareInfoRepository {

	private final SoftwareInfoRepository origin;

	public OrderByDateSIRDecorator(SoftwareInfoRepository origin) {
		this.origin = Objects.requireNonNull(origin);
	}

	@Override
	public Collection<RepositoryUrlData> data() {
		Collection<RepositoryUrlData> data = origin.data();
		return data.stream()
				.sorted(Comparator.comparing(RepositoryUrlData::lastUpdated, Comparator.nullsFirst(Comparator.naturalOrder())))
				.toList();
	}

	@Override
	public Collection<LicenseData> licenseData() {
		Collection<LicenseData> data = origin.licenseData();
		return data.stream()
				.sorted(Comparator.comparing(LicenseData::lastUpdated, Comparator.nullsFirst(Comparator.naturalOrder())))
				.toList();
	}

	@Override
	public void save(String data) {
		origin.save(data);
	}
}
