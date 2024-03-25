// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"bytes"
	"codemeta/terms"
	"codemeta/utils"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
)

func main() {
	jwtSecret, ok := os.LookupEnv("PGRST_JWT_SECRET")
	if !ok {
		log.Fatal("No JWT secret found")
	}
	adminJwt := getAdminJwt(jwtSecret)

	backendUrl, ok := os.LookupEnv("POSTGREST_URL")
	if !ok {
		log.Fatal("No JWT secret found")
	}

	const url4tu = "https://data.4tu.nl/v3/datasets/codemeta?modified_since=2024-01-01T00:00:00&limit=50"

	bodyBytes, err := utils.GetAndReadBody(url4tu)

	if err != nil {
		log.Fatal(err)
	}

	items := []terms.SoftwareApplication{}

	err = json.Unmarshal(bodyBytes, &items)
	if err != nil {
		log.Fatal(err)
	}

	err = saveApplicationsInRsd(items, adminJwt, backendUrl)
	if err != nil {
		log.Fatal(err)
	}
}

type RsdSoftwareTable struct {
	IsPublished bool    `json:"is_published"`
	Slug        string  `json:"slug"`
	BrandName   string  `json:"brand_name"`
	ConceptDoi  *string `json:"concept_doi"`
	Description *string `json:"description"`
}

var nonLowerLetter = regexp.MustCompile("[^a-z]")
var multipleDashes = regexp.MustCompile("-{2,}")

func nameToSlug(name string) string {
	lower := strings.ToLower(name)
	lowerWithDashes := nonLowerLetter.ReplaceAllString(lower, "-")
	slug := multipleDashes.ReplaceAllString(lowerWithDashes, "-")
	slug = strings.TrimPrefix(slug, "-")
	slug = strings.TrimSuffix(slug, "-")
	return slug
}

var versionDoiPostfix = regexp.MustCompile("\\.v\\d+$")

func extractConceptDoi(doi *string) *string {
	if doi == nil {
		return nil
	}

	conceptDoi := versionDoiPostfix.ReplaceAllString(*doi, "")
	return &conceptDoi
}

func extractAndEscapeDescription(description terms.SingleOrArray[string]) *string {
	if description.Single != nil {
		result := html.EscapeString(*description.Single)
		return &result
	}

	return nil
}

func saveApplicationsInRsd(softwareSlice []terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	var err error

	for _, software := range softwareSlice {
		rsdSoftware := RsdSoftwareTable{
			IsPublished: true,
			Slug:        nameToSlug(software.Name),
			BrandName:   software.Name,
			ConceptDoi:  extractConceptDoi(software.Id),
			Description: extractAndEscapeDescription(software.Description),
		}

		id, localErr := createOrUpdateBasicSoftware(rsdSoftware, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		localErr = saveKeywordsForSoftware(id, software, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		localErr = saveContributorsForSoftware(id, software, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		localErr = saveLicensesForSoftware(id, software, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		localErr = saveRepositoryUrlForSoftware(id, software, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}
	}

	return err
}

var defaultClient = http.DefaultClient

func createOrUpdateBasicSoftware(rsdSoftware RsdSoftwareTable, adminJwt string, backendUrl string) (string, error) {
	if rsdSoftware.ConceptDoi == nil {
		return "", fmt.Errorf("software with title %v has no concept DOI", rsdSoftware.BrandName)
	}

	// see if software exists on DOI:
	conceptDoi := *rsdSoftware.ConceptDoi
	request, err := http.NewRequest("GET", backendUrl+"/software?select=id&concept_doi=eq."+conceptDoi, nil)
	if err != nil {
		return "", err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)

	resp, err := defaultClient.Do(request)
	if err != nil {
		return "", err
	}

	bodyBytes, err := utils.ReadBody(resp)
	type response struct {
		Id string `json:"id"`
	}
	var responseContainer []response
	err = json.Unmarshal(bodyBytes, &responseContainer)
	if err != nil {
		return "", err
	}

	// multiple software entries exist with concept DOI, don't know how to continue, error
	if len(responseContainer) >= 2 {
		return "", fmt.Errorf("multiple software entries found for concept DOI %v", conceptDoi)
	}

	jsonBytes, err := json.Marshal(&rsdSoftware)
	if err != nil {
		return "", nil
	}

	// software with concept DOI doesn't exist yet, create it
	if len(responseContainer) == 0 {
		request, err = http.NewRequest("POST", backendUrl+"/software?select=id", bytes.NewBuffer(jsonBytes))
		if err != nil {
			return "", err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)
		request.Header.Add("Prefer", "return=representation")
		request.Header.Add("Accept", "application/vnd.pgrst.object+json")

		resp, err = defaultClient.Do(request)
		if err != nil {
			return "", err
		}

		if resp.StatusCode >= 400 {
			println(rsdSoftware.BrandName)
			println(rsdSoftware.Slug)
			println(resp.StatusCode)
			respBody, _ := io.ReadAll(resp.Body)
			println(string(respBody))

			return "", fmt.Errorf("got status code %d when creating new software", resp.StatusCode)
		}

		responseBytes, err := utils.ReadBody(resp)
		if err != nil {
			return "", err
		}

		var createdContainer response
		err = json.Unmarshal(responseBytes, &createdContainer)
		if err != nil {
			return "", err
		}

		return createdContainer.Id, nil
	} else {
		// software with concept DOI already exists, update it
		id := responseContainer[0].Id

		request, err = http.NewRequest("PATCH", backendUrl+"/software?id=eq."+id, bytes.NewBuffer(jsonBytes))
		if err != nil {
			return "", err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)

		resp, err = defaultClient.Do(request)
		if err != nil {
			return "", err
		}

		if resp.StatusCode >= 400 {
			println(rsdSoftware.BrandName)
			println(rsdSoftware.Slug)
			println(resp.StatusCode)
			respBody, _ := io.ReadAll(resp.Body)
			println(string(respBody))

			return "", fmt.Errorf("got status code %d when updating existing software", resp.StatusCode)
		}

		return id, nil
	}
}

func saveKeywordsForSoftware(id string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	var err error
	for _, keyword := range software.Keywords {
		request, localErr := http.NewRequest("GET", backendUrl+"/keyword?value=eq."+url.QueryEscape(keyword), nil)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)
		resp, localErr := defaultClient.Do(request)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		type keywordRsd struct {
			Id string `json:"id"`
		}
		respBytes, localErr := utils.ReadBody(resp)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		var responseSlice []keywordRsd
		localErr = json.Unmarshal(respBytes, &responseSlice)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		if len(responseSlice) == 0 {
			request, localErr = http.NewRequest("POST", backendUrl+"/keyword?select=id", strings.NewReader("{\"value\": \""+keyword+"\"}"))
			if localErr != nil {
				err = errors.Join(err, localErr)
				continue
			}

			request.Header.Add("Authorization", "Bearer "+adminJwt)
			request.Header.Add("Prefer", "return=representation")

			resp, localErr = defaultClient.Do(request)
			if localErr != nil {
				err = errors.Join(err, localErr)
				continue
			}

			respBytes, localErr = utils.ReadBody(resp)
			if localErr != nil {
				err = errors.Join(err, localErr)
				continue
			}

			localErr = json.Unmarshal(respBytes, &responseSlice)
			if localErr != nil {
				err = errors.Join(err, localErr)
				continue
			}
		}

		keywordId := responseSlice[0].Id
		jsonBody := fmt.Sprintf("{\"software\": \"%v\", \"keyword\": \"%v\"}", id, keywordId)
		request, localErr = http.NewRequest("POST", backendUrl+"/keyword_for_software", strings.NewReader(jsonBody))
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)

		resp, localErr = defaultClient.Do(request)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}
	}

	return err
}

var orcidRegexp = regexp.MustCompile("^\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$")

func saveContributorsForSoftware(id string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	request, err := http.NewRequest("DELETE", backendUrl+"/contributor?software=eq."+id, nil)
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	type rsdContributor struct {
		Software     string  `json:"software"`
		FamilyNames  string  `json:"family_names"`
		GivenNames   string  `json:"given_names"`
		Affiliation  *string `json:"affiliation"`
		Orcid        *string `json:"orcid"`
		EmailAddress *string `json:"email_address"`
	}

	var contributors = make([]rsdContributor, 0, len(software.Author))
	for _, person := range software.Author {
		var affiliation *string
		if person.Affiliation != nil {
			affiliation = &person.Affiliation.Name
		}

		var orcid *string
		if person.Id != nil {
			personId := *person.Id
			if strings.HasPrefix(personId, "https://orcid.org/") {
				possibleOrcid := strings.TrimPrefix(personId, "https://orcid.org/")
				if orcidRegexp.MatchString(possibleOrcid) {
					orcid = &possibleOrcid
				}
			}
		}

		contributor := rsdContributor{
			Software:     id,
			FamilyNames:  person.FamilyName,
			GivenNames:   person.GivenName,
			Affiliation:  affiliation,
			Orcid:        orcid,
			EmailAddress: person.Email,
		}

		contributors = append(contributors, contributor)
	}

	body, err := json.Marshal(&contributors)
	if err != nil {
		return err
	}

	request, err = http.NewRequest("POST", backendUrl+"/contributor", bytes.NewReader(body))
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	return nil
}

func saveLicensesForSoftware(id string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	request, err := http.NewRequest("DELETE", backendUrl+"/license_for_software?software=eq."+id, nil)
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	type rsdLicense struct {
		Software string `json:"software"`
		License  string `json:"license"`
	}

	if software.License.Single == nil {
		return nil
	}

	// TODO: extract license(s) in different cases
	licenseUrl := *software.License.Single.Url
	var licenseVal string
	if strings.HasPrefix(licenseUrl, "https://spdx.org/licenses/") {
		licenseVal = strings.TrimPrefix(licenseUrl, "https://spdx.org/licenses/")
	}
	var license = rsdLicense{
		Software: id,
		License:  licenseVal,
	}

	body, err := json.Marshal(&license)
	if err != nil {
		return err
	}

	request, err = http.NewRequest("POST", backendUrl+"/license_for_software", bytes.NewReader(body))
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	return nil
}

func saveRepositoryUrlForSoftware(id string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	request, err := http.NewRequest("DELETE", backendUrl+"/repository_url?software=eq."+id, nil)
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	type rsdRepositoryUrl struct {
		Software     string `json:"software"`
		Url          string `json:"url"`
		CodePlatform string `json:"code_platform"`
	}

	if software.CodeRepository == nil {
		return nil
	}

	repositoryUrl := rsdRepositoryUrl{
		Software:     id,
		Url:          *software.CodeRepository,
		CodePlatform: "4tu",
	}

	body, err := json.Marshal(&repositoryUrl)
	if err != nil {
		return err
	}

	request, err = http.NewRequest("POST", backendUrl+"/repository_url", bytes.NewReader(body))
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	return nil
}
