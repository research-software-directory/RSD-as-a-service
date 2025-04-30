// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import nl.esciencecenter.rsd.scraper.doi.ExternalMentionRecord;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;

class BibtexParserTest {

	@Test
	void givenValidBibtex_whenParsing_thenParsedCorrectly() throws InvalidInputException, IOException {
		String validBibtex = """
			@misc{Brughmans2018,
			author = {Brughmans, Tom},
			title = {{Network structures and assembling code in Netlogo, Tutorial}},
			url = {https://archaeologicalnetworks.wordpress.com/resources/#structures},
			year = {2018}
			}
			@article{Brughmans2016c,
			author = {Brughmans, Tom and Poblome, Jeroen},
			doi = {10.15184/aqy.2016.35},
			file = {:Users/au656977/Library/Application Support/Mendeley Desktop/Downloaded/Brughmans, Poblome - 2016 - Roman bazaar or market economy Explaining tableware distributions through computational modelling.pdf:pdf},
			journal = {Antiquity},
			mendeley-groups = {Brughmans,PNAS,old/ERC_StG2019_B2,old/ERC_StG2019_B1,Roman-simulations,TO ADD,TRAJ manifesto,ERCStG2021_B2},
			number = {350},
			pages = {393--408},
			title = {{Roman bazaar or market economy? Explaining tableware distributions through computational modelling}},
			volume = {90},
			year = {2016}
			}
			@article{Brughmans2016d,
			author = {Brughmans, Tom and Poblome, Jeroen},
			file = {:Users/au656977/Library/Application Support/Mendeley Desktop/Downloaded/Brughmans, Poblome - 2016 - MERCURY an agent-based model of tableware trade in the Roman East.pdf:pdf},
			journal = {Journal of Artificial Societies and Social Simulation},
			mendeley-groups = {Brughmans,old/ERC_StG2019_B2,Roman-simulations,TO ADD,TRAJ manifesto},
			number = {1},
			pages = {http://jasss.soc.surrey.ac.uk/19/1/3.html},
			title = {{MERCURY: an agent-based model of tableware trade in the Roman East}},
			volume = {19},
			year = {2016}
			}
			""";

		Map<String, ExternalMentionRecord> result = BibtexParser.parse(new StringReader(validBibtex));

		Assertions.assertEquals(3, result.size());
		Assertions.assertEquals("Brughmans, Tom", result.get("Brughmans2018").authors());
		Assertions.assertEquals("Network structures and assembling code in Netlogo, Tutorial", result.get("Brughmans2018")
			.title());
		Assertions.assertEquals(2018, result.get("Brughmans2018").publicationYear());
	}

	@Test
	void givenValidBibtex_whenParsing_thenParsedCorrectly2() throws InvalidInputException, IOException {
		String validBibtex = """
			@book{romanowska_agent-based_2021,
				edition = {Electronic},
				title = {Agent-{Based} {Modeling} for {Archaeology}},
				isbn = {978-1-947864-38-2},
				url = {https://www.sfipress.org/books/agent-based-modeling-archaeology},
				abstract = {To fully understand not only the past, but also the trajectories, of human societies, we need a more dynamic view of human social systems. Agent-based modeling (ABM), which can create fine-scale models of behavior over time and space, may reveal important, general patterns of human activity. Agent-Based Modeling for Archaeology is the first ABM textbook designed for researchers studying the human past. Appropriate for scholars from archaeology, the digital humanities, and other social sciences, this book offers novices and more experienced ABM researchers a modular approach to learning ABM and using it effectively.  Readers will find the necessary background, discussion of modeling techniques and traps, references, and algorithms to use ABM in their own work. They will also find engaging examples of how other scholars have applied ABM, ranging from the study of the intercontinental migration pathways of early hominins, to the weather–crop–population cycles of the American Southwest, to the trade networks of Ancient Rome. This textbook provides the foundations needed to simulate the complexity of past human societies, offering researchers a richer understanding of the past—and likely future—of our species.},
				urldate = {2022-02-01},
				publisher = {SFI Press},
				author = {Romanowska, Iza},
				month = aug,
				year = {2021},
				doi = {10.37911/9781947864382},
			}""";

		Map<String, ExternalMentionRecord> result = BibtexParser.parse(new StringReader(validBibtex));

		Assertions.assertEquals(1, result.size());
		Assertions.assertEquals("Romanowska, Iza", result.get("romanowska_agent-based_2021").authors());
		Assertions.assertEquals("Agent-Based Modeling for Archaeology", result.get("romanowska_agent-based_2021")
			.title());
		Assertions.assertEquals("10.37911/9781947864382", result.get("romanowska_agent-based_2021").doi().toString());
		Assertions.assertEquals(2021, result.get("romanowska_agent-based_2021").publicationYear());
	}
}
