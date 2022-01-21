package nl.esciencecenter.rsd.scraper.language;

import java.util.Collection;
import java.util.Comparator;
import java.util.Objects;

public class OrderByDatePLRDecorator implements ProgrammingLanguagesRepository {

	private final ProgrammingLanguagesRepository origin;

	public OrderByDatePLRDecorator(ProgrammingLanguagesRepository origin) {
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
	public void save(String data) {
		origin.save(data);
	}
}
