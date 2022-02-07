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
	public Collection<RepositoryUrlData> languagesData() {
		Collection<RepositoryUrlData> data = origin.languagesData();
		return data.stream()
				.sorted(Comparator.comparing(RepositoryUrlData::languagesScrapedAt, Comparator.nullsFirst(Comparator.naturalOrder())))
				.toList();
	}

	@Override
	public Collection<RepositoryUrlData> licenseData() {
		Collection<RepositoryUrlData> data = origin.licenseData();
		return data.stream()
				.sorted(Comparator.comparing(RepositoryUrlData::licenseScrapedAt, Comparator.nullsFirst(Comparator.naturalOrder())))
				.toList();
	}

	@Override
	public Collection<RepositoryUrlData> commitData() {
		Collection<RepositoryUrlData> data = origin.licenseData();
		return data.stream()
				.sorted(Comparator.comparing(RepositoryUrlData::commitHistoryScrapedAt, Comparator.nullsFirst(Comparator.naturalOrder())))
				.toList();
	}

	@Override
	public void save(Collection<RepositoryUrlData> data) {
		origin.save(data);
	}
}
