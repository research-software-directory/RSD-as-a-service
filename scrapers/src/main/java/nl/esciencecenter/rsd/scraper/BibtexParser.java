// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import nl.esciencecenter.rsd.scraper.doi.Doi;
import nl.esciencecenter.rsd.scraper.doi.ExternalMentionRecord;
import nl.esciencecenter.rsd.scraper.doi.MentionType;

import java.io.IOException;
import java.io.LineNumberReader;
import java.io.Reader;
import java.net.URI;
import java.util.Map;
import java.util.TreeMap;

// https://www.bibtex.org/Format/
// https://www.bibtex.com/e/entry-types/
public class BibtexParser {

	static final Map<String, MentionType> BIBTEX_ENTRY_TO_MENTION_TYPE = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

	static {
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("article", MentionType.journalArticle);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("book", MentionType.book);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("booklet", MentionType.book);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("conference", MentionType.conferencePaper);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("inbook", MentionType.bookSection);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("incollection", MentionType.bookSection);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("inproceedings", MentionType.conferencePaper);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("manual", MentionType.other);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("mastersthesis", MentionType.thesis);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("misc", MentionType.other);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("phdthesis", MentionType.thesis);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("proceedings", MentionType.book);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("techreport", MentionType.other);
		BIBTEX_ENTRY_TO_MENTION_TYPE.put("unpublished", MentionType.other);
	}

	enum ParserState {
		BETWEEN_ENTRIES,
		READING_ENTRY_TYPE,
		READING_ENTRY_OUTER_BRACE,
		BEFORE_READING_CITEKEY,
		READING_CITEKEY,
		BEFORE_READING_KEY,
		READING_KEY,
		READING_EQUALS_SIGN,
		READING_VALUE_DELIMITER,
		READING_MONTH,
		READING_INTEGER,
		READING_VALUE,
		READING_COMMA
	}

	public static Map<String, ExternalMentionRecord> parse(Reader reader) throws IOException, InvalidInputException {
		Map<String, ExternalMentionRecord> result = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
		LineNumberReader lineNumberReader = new LineNumberReader(reader);
		lineNumberReader.setLineNumber(1);
		ParserState state = ParserState.BETWEEN_ENTRIES;
		StringBuilder stringBuilder = new StringBuilder();
		int column = 0;
		char valueDelimiter = 0;
		int openBraceCount = 0;

		String entryType = null;
		String citekey = null;
		String key = null;

		Map<String, String> keyValues = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

		while (true) {
			int nextCharAsInt = lineNumberReader.read();
			if (nextCharAsInt == -1) {
				return handleEndOfInput(result, state);
			}

			char c = (char) nextCharAsInt;
			if (c == '\n') {
				column = 0;
			} else {
				++column;
			}

			switch (state) {
				case BETWEEN_ENTRIES -> {
					if (c == '@') {
						state = ParserState.READING_ENTRY_TYPE;
						stringBuilder.setLength(0);
					}
					// we accept all other character as comments (and ignore them) to accommodate the comma between the entries on line 7 from
					// https://github.com/Archaeology-ABM/NASSA-modules/blob/main/2022-Verhagen-001/references.bib
				}
				case READING_ENTRY_TYPE -> {
					if (Character.isWhitespace(c) || c == '{') {
						if (stringBuilder.isEmpty()) {
							throw new InvalidInputException("READING_ENTRY_TYPE Empty entry type at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
						}
						entryType = stringBuilder.toString();
						stringBuilder.setLength(0);
						state = c == '{' ? ParserState.BEFORE_READING_CITEKEY : ParserState.READING_ENTRY_OUTER_BRACE;
					} else if (!isAsciiLetter(c)) {
						throw new InvalidInputException("READING_ENTRY_TYPE Expected a letter but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					} else {
						stringBuilder.append(c);
					}
				}
				case READING_ENTRY_OUTER_BRACE -> {
					if (c == '{') {
						state = ParserState.BEFORE_READING_KEY;
					} else if (!Character.isWhitespace(c)) {
						throw new InvalidInputException("READING_ENTRY_OUTER_BRACE Expected { or whitespace but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
				case BEFORE_READING_CITEKEY -> {
					if (!isValidCitekeyCharacter(c)) {
						throw new InvalidInputException("BEFORE_READING_CITEKEY Expected an alphanumeric character or - or _ or : but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					} else if (!Character.isWhitespace(c)) {
						stringBuilder.setLength(0);
						stringBuilder.append(c);
						state = ParserState.READING_CITEKEY;
					}
				}
				case READING_CITEKEY -> {
					if (isValidCitekeyCharacter(c)) {
						stringBuilder.append(c);
					} else if (c == ',') {
						if (stringBuilder.isEmpty()) {
							throw new InvalidInputException("READING_CITEKEY Empty citekey at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
						}
						citekey = stringBuilder.toString();
						stringBuilder.setLength(0);
						state = ParserState.BEFORE_READING_KEY;
					} else {
						throw new InvalidInputException("READING_CITEKEY Expected an alphanumeric character or - or _ or : but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
				case BEFORE_READING_KEY -> {
					if (c == '}') {
						state = ParserState.BETWEEN_ENTRIES;
						handleEntry(keyValues, entryType, citekey, result);
					} else if (isAsciiLetter(c)) {
						stringBuilder.setLength(0);
						stringBuilder.append(c);
						state = ParserState.READING_KEY;
					} else if (!Character.isWhitespace(c)) {
						throw new InvalidInputException("BEFORE_READING_KEY Expected a letter but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
				case READING_KEY -> {
					// '-' needed to handle key mendeley-groups
					if (isAsciiLetter(c) || c == '-') {
						stringBuilder.append(c);
					} else if (Character.isWhitespace(c) || c == '=') {
						if (stringBuilder.isEmpty()) {
							throw new InvalidInputException("READING_KEY Empty key at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
						}
						key = stringBuilder.toString();
						stringBuilder.setLength(0);
						state = c == '=' ? ParserState.READING_VALUE_DELIMITER : ParserState.READING_EQUALS_SIGN;
					} else {
						throw new InvalidInputException("READING_KEY Expected a letter or whitespace or = but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
				case READING_EQUALS_SIGN -> {
					if (c == '=') {
						state = ParserState.READING_VALUE_DELIMITER;
					} else if (Character.isWhitespace(c)) {
						throw new InvalidInputException("READING_EQUALS_SIGN Expected whitespace or = but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
				case READING_VALUE_DELIMITER -> {
					if (c == '{' || c == '"') {
						valueDelimiter = c;
						stringBuilder.setLength(0);
						state = ParserState.READING_VALUE;
					} else if (isAsciiLetter(c)) {
						valueDelimiter = 0;
						stringBuilder.setLength(0);
						stringBuilder.append(c);
						state = ParserState.READING_MONTH;
					} else if (isAsciiDigit(c)) {
						valueDelimiter = 0;
						stringBuilder.setLength(0);
						stringBuilder.append(c);
						state = ParserState.READING_INTEGER;
					} else if (!Character.isWhitespace(c)) {
						throw new InvalidInputException("READING_VALUE_DELIMITER Expected whitespace or { or \" but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
				case READING_MONTH -> {
					if (isAsciiLetter(c)) {
						if (stringBuilder.length() < 3) {
							stringBuilder.append(c);
						} else {
							throw new InvalidInputException("READING_MONTH Month literal too long at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
						}
					} else if (Character.isWhitespace(c) || c == ',') {
						if (stringBuilder.length() != 3) {
							throw new InvalidInputException("READING_MONTH Month literal too short at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
						} else {
							keyValues.put(key, stringBuilder.toString());
							stringBuilder.setLength(0);
							state = c == ',' ? ParserState.BEFORE_READING_KEY : ParserState.READING_COMMA;
						}
					} else {
						throw new InvalidInputException("READING_MONTH Illegal month literal at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
					}
				}
				case READING_INTEGER -> {
					if (isAsciiDigit(c)) {
						stringBuilder.append(c);
					} else if (Character.isWhitespace(c) || c == ',') {
						keyValues.put(key, stringBuilder.toString());
						stringBuilder.setLength(0);
						state = c == ',' ? ParserState.BEFORE_READING_KEY : ParserState.READING_COMMA;
					} else {
						throw new InvalidInputException("READING_INTEGER Illegal integer literal at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
					}
				}
				case READING_VALUE -> {
					if (c == '{') {
						++openBraceCount;
					} else if (c == '}') {
						--openBraceCount;
						if (openBraceCount < 0 && valueDelimiter != '{') {
							throw new InvalidInputException("READING_VALUE Unmatched closing brace at line %d, column %d".formatted(lineNumberReader.getLineNumber(), column));
						} else if (openBraceCount < 0) {
							keyValues.put(key, stringBuilder.toString());
							stringBuilder.setLength(0);
							openBraceCount = 0;
							state = ParserState.READING_COMMA;
						}
					} else if (c == '"' && valueDelimiter == '"') {
						keyValues.put(key, stringBuilder.toString());
						stringBuilder.setLength(0);
						state = ParserState.READING_COMMA;
					} else {
						stringBuilder.append(c);
					}
				}
				case READING_COMMA -> {
					if (c == ',') {
						state = ParserState.BEFORE_READING_KEY;
					} else if (c == '}') {
						state = ParserState.BETWEEN_ENTRIES;
						handleEntry(keyValues, entryType, citekey, result);
					} else if (!Character.isWhitespace(c)) {
						throw new InvalidInputException("READING_COMMA Expected whitespace or , or } but got %c at line %d, column %d".formatted(c, lineNumberReader.getLineNumber(), column));
					}
				}
			}
		}
	}

	static Map<String, ExternalMentionRecord> handleEndOfInput(Map<String, ExternalMentionRecord> result, ParserState state) throws InvalidInputException {
		if (state == ParserState.BETWEEN_ENTRIES) {
			return result;
		} else {
			throw new InvalidInputException("End of input reached while in state %s".formatted(state));
		}
	}

	static boolean isValidCitekeyCharacter(char c) {
		return (c >= 'a' && c <= 'z')
			||
			(c >= 'A' && c <= 'Z')
			||
			(c >= '0' && c <= '9')
			||
			c == '-'
			||
			c == '_'
			||
			c == ':';
	}

	static boolean isAsciiLetter(char c) {
		return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
	}

	static boolean isAsciiDigit(char c) {
		return c >= '0' && c <= '9';
	}

	static void handleEntry(
		Map<String, String> keyValues,
		String entryType,
		String citekey,
		Map<String, ExternalMentionRecord> mapToAddTo
	) {
		String doiString = keyValues.get("doi");
		Doi doi = Doi.isValid(doiString) ? Doi.fromString(doiString) : null;
		String urlString = keyValues.get("url");
		URI url = null;
		if (doi != null) {
			url = URI.create("https://doi.org/" + doi.toUrlEncodedString());
		} else if (urlString != null) {
			url = URI.create(urlString);
		}
		String title = keyValues.get("title");
		String authors = keyValues.get("author");
		String publisher = keyValues.get("publisher");
		Integer publicationYear = null;
		if (keyValues.get("year") != null) {
			publicationYear = Integer.parseInt(keyValues.get("year"));
		}
		String journal = keyValues.get("journal");
		String page = keyValues.get("pages");
		MentionType mentionType = BIBTEX_ENTRY_TO_MENTION_TYPE.getOrDefault(entryType, MentionType.other);
		String source = "NASSA";

		ExternalMentionRecord recordToAdd = new ExternalMentionRecord(
			doi,
			null,
			null,
			url,
			title,
			authors,
			publisher,
			publicationYear,
			journal,
			page,
			mentionType,
			source,
			null
		);

		mapToAddTo.put(citekey, recordToAdd);
		keyValues.clear();
	}
}

