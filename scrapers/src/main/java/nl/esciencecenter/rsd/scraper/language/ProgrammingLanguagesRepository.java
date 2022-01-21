package nl.esciencecenter.rsd.scraper.language;

import java.util.Collection;

public interface ProgrammingLanguagesRepository {

	Collection<RepositoryUrlData> data();

	void save(String data);
}
