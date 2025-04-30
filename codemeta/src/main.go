// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"bytes"
	"codemeta/terms"
	"codemeta/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"slices"
)

type RsdSoftware struct {
	BrandName       string  `json:"brand_name"`
	ConceptDoi      *string `json:"concept_doi"`
	ShortStatement  *string `json:"short_statement"`
	DescriptionType string  `json:"description_type"`
	Description     *string `json:"description"`
	DescriptionUrl  *string `json:"description_url"`
	Contributor     []struct {
		FamilyNames  string  `json:"family_names"`
		GivenNames   string  `json:"given_names"`
		Affiliation  *string `json:"affiliation"`
		EmailAddress *string `json:"email_address"`
		Orcid        *string `json:"orcid"`
		Role         *string `json:"role"`
	} `json:"contributor"`
	Keyword []struct {
		Value string `json:"value"`
	} `json:"keyword"`
	License []struct {
		License string `json:"license"`
	} `json:"license_for_software"`
	RepositoryURL *struct {
		URL       string             `json:"url"`
		Languages map[string]float64 `json:"languages"`
	} `json:"repository_url"`
	ReferencePapers []struct {
		Doi   *string `json:"doi"`
		Title string  `json:"title"`
		Page  *string `json:"page"`
		Url   *string `json:"url"`
	} `json:"reference_papers"`
}

var slugRegex *regexp.Regexp = regexp.MustCompile("^[a-z0-9]+(-[a-z0-9]+)*$")

func main() {
	postgrestUrl := os.Getenv("POSTGREST_URL")
	if postgrestUrl == "" {
		log.Print("No value found for POSTGREST_URL, defaulting to http://backend:3500")
		postgrestUrl = "http://backend:3500"
	}

	http.HandleFunc("GET /{other}/", func(writer http.ResponseWriter, request *http.Request) {
		http.Redirect(writer, request, "/", http.StatusMovedPermanently)
	})

	http.HandleFunc("GET /", func(writer http.ResponseWriter, request *http.Request) {
		urlUnformatted := "%v/software?select=slug,brand_name,short_statement&order=brand_name"
		url := fmt.Sprintf(urlUnformatted, postgrestUrl)
		bodyBytes, err := utils.GetAndReadBody(url)
		if err != nil {
			log.Print("Unknown error when downloading software overview: ", err)
			writer.WriteHeader(http.StatusInternalServerError)
			_, err := writer.Write([]byte("Server error"))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
			return
		}

		byteBuffer := &bytes.Buffer{}
		err = GenerateOverview(bodyBytes, byteBuffer)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			_, err := writer.Write([]byte("Unknown error when generating software overview, please provide a slug"))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
		}

		_, err = byteBuffer.WriteTo(writer)
		if err != nil {
			log.Print("Couldn't write response after generating the overview: ", err)
		}
	})

	http.HandleFunc("GET /v3/{slug}/{other}/", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusBadRequest)
		_, err := writer.Write([]byte("The slug is not valid"))
		if err != nil {
			log.Print("Couldn't write response: ", err)
		}
	})

	http.HandleFunc("GET /favicon.ico", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusNoContent)
	})

	http.HandleFunc("GET /v3/{slug}/", func(writer http.ResponseWriter, request *http.Request) {
		slug := request.PathValue("slug")

		if len(slug) > 200 {
			writer.WriteHeader(http.StatusBadRequest)
			_, err := writer.Write([]byte("The slug should be at most 200 characters"))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
			return
		}

		if !slugRegex.MatchString(slug) {
			writer.WriteHeader(http.StatusBadRequest)
			_, err := writer.Write([]byte("The slug is not valid"))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
			return
		}

		urlUnformatted := "%v/software?slug=eq.%v&select=brand_name,concept_doi,short_statement,description_type,description,description_url,contributor(family_names,given_names,affiliation,role,orcid,email_address),keyword(value),license_for_software(license),repository_url(url,languages),reference_papers:mention!reference_paper_for_software(doi,title,page,url)"
		url := fmt.Sprintf(urlUnformatted, postgrestUrl, slug)

		bodyBytes, err := utils.GetAndReadBody(url)
		if err != nil {
			log.Print("Unknown error when downloading data for slug "+slug+": ", err)
			writer.WriteHeader(http.StatusInternalServerError)
			_, err := writer.Write([]byte("Server error"))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
			return
		}

		jsonBytes, err := convertRsdToCodeMeta(bodyBytes)
		if err != nil {
			log.Print("Unknown error for slug "+slug+": ", err)
			writer.WriteHeader(http.StatusInternalServerError)
			_, err := writer.Write([]byte("Server error"))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
			return
		}
		if jsonBytes == nil {
			writer.WriteHeader(http.StatusNotFound)
			_, err := writer.Write([]byte("No software found with slug " + slug))
			if err != nil {
				log.Print("Couldn't write response: ", err)
			}
			return
		}

		writer.Header().Add("Content-Type", "application/ld+json")
		_, err = writer.Write(jsonBytes)
		if err != nil {
			log.Print("Couldn't write response: ", err)
		}
	})

	fmt.Println("Serving on http://localhost:8000")

	err := http.ListenAndServe(":8000", nil)

	if err != nil {
		log.Fatal("Couldn't start HTTP server: ", err)
	}
}

func convertRsdToCodeMeta(bytes []byte) ([]byte, error) {
	var rsdResponseArray []RsdSoftware
	err := json.Unmarshal(bytes, &rsdResponseArray)
	if err != nil {
		return nil, err
	}

	if len(rsdResponseArray) == 0 {
		return nil, nil
	}

	rsdResponse := rsdResponseArray[0]

	var codemetaData = terms.SoftwareApplication{
		Context:              "https://w3id.org/codemeta/v3.0",
		Id:                   rsdResponse.ConceptDoi,
		Type:                 "SoftwareApplication",
		Name:                 rsdResponse.BrandName,
		Description:          extractDescription(rsdResponse),
		Author:               extractContributors(rsdResponse),
		Keywords:             extractKeywords(rsdResponse),
		ProgrammingLanguage:  extractProgrammingLanguages(rsdResponse),
		License:              extractLicenses(rsdResponse),
		ReferencePublication: extractReferencePublications(rsdResponse),
		DownloadUrl:          []string{},
	}

	if rsdResponse.RepositoryURL != nil {
		codemetaData.CodeRepository = &rsdResponse.RepositoryURL.URL
	}

	jsonBytes, err := json.Marshal(codemetaData)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return jsonBytes, nil
}

func extractDescription(rsdSoftware RsdSoftware) terms.SingleOrArray[string] {
	descriptions := []string{}

	if rsdSoftware.ShortStatement != nil {
		descriptions = append(descriptions, *rsdSoftware.ShortStatement)
	}

	if rsdSoftware.DescriptionType == "markdown" && rsdSoftware.Description != nil {
		descriptions = append(descriptions, *rsdSoftware.Description)
	}

	if rsdSoftware.DescriptionType == "link" && rsdSoftware.DescriptionUrl != nil {
		descriptions = append(descriptions, *rsdSoftware.DescriptionUrl)
	}

	return terms.SingleOrArray[string]{
		Single: nil,
		Array:  descriptions,
	}
}

func extractKeywords(rsdSoftware RsdSoftware) []string {
	result := []string{}

	for _, jsonKeyword := range rsdSoftware.Keyword {
		keyword := jsonKeyword.Value

		result = append(result, keyword)
	}

	return result
}

func extractProgrammingLanguages(rsdSoftware RsdSoftware) []string {
	result := []string{}

	if rsdSoftware.RepositoryURL == nil {
		return result
	}

	for k := range rsdSoftware.RepositoryURL.Languages {
		result = append(result, k)
	}

	slices.SortFunc(result, func(a, b string) int {
		valA := rsdSoftware.RepositoryURL.Languages[a]
		valB := rsdSoftware.RepositoryURL.Languages[b]

		if valA > valB {
			return -1
		} else if valA < valB {
			return 1
		} else {
			return 0
		}
	})

	return result
}

func extractLicenses(rsdSoftware RsdSoftware) terms.SingleOrArray[terms.CreativeWorkOrUrl] {
	licenses := []terms.CreativeWorkOrUrl{}

	for _, jsonLicense := range rsdSoftware.License {
		license := terms.CreativeWork{
			Type: "creativeWork",
			Name: jsonLicense.License,
		}

		creativeWorkOrUrl := terms.CreativeWorkOrUrl{
			CreativeWork: &license,
			Url:          nil,
		}
		licenses = append(licenses, creativeWorkOrUrl)
	}

	return terms.SingleOrArray[terms.CreativeWorkOrUrl]{
		Single: nil,
		Array:  licenses,
	}
}

func extractReferencePublications(rsdSoftware RsdSoftware) []terms.ScholarlyArticle {
	result := []terms.ScholarlyArticle{}

	for _, referencePaper := range rsdSoftware.ReferencePapers {
		referencePublication := terms.ScholarlyArticle{
			Type:       "ScholarlyArticle",
			Id:         referencePaper.Doi,
			Name:       referencePaper.Title,
			Pagination: referencePaper.Page,
			Url:        referencePaper.Url,
		}

		result = append(result, referencePublication)
	}

	return result
}

func extractContributors(rsdSoftware RsdSoftware) []terms.Person {
	result := []terms.Person{}

	for _, jsonContributor := range rsdSoftware.Contributor {
		person := terms.Person{
			Type:       "Person",
			Id:         jsonContributor.Orcid,
			GivenName:  jsonContributor.GivenNames,
			FamilyName: jsonContributor.FamilyNames,
			Name:       jsonContributor.GivenNames + " " + jsonContributor.FamilyNames,
			Email:      jsonContributor.EmailAddress,
			RoleName:   jsonContributor.Role,
		}

		if jsonContributor.Orcid != nil {
			const orcidUrlPrefix string = "https://orcid.org/"
			var orcid string = *jsonContributor.Orcid
			var orcidUrl string = orcidUrlPrefix + orcid
			person.Id = &orcidUrl
		}

		if jsonContributor.Affiliation != nil {
			person.Affiliation = &terms.Organization{
				Type: "Organization",
				Name: *jsonContributor.Affiliation,
			}
		}

		result = append(result, person)
	}

	return result
}
