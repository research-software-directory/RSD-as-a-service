// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"bytes"
	"codemeta/terms"
	"codemeta/utils"
	"crypto/sha1"
	_ "embed"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
)

//go:embed 4tu-logo.png
var fourTuLogoBytes []byte

func main() {
	isEnabled, ok := os.LookupEnv("ENABLE_4TU_SCRAPER")
	if !ok || isEnabled != "true" {
		log.Println("4TU scraper is disabled")
		return
	}

	log.Println("Starting 4TU scraper")

	jwtSecret, ok := os.LookupEnv("PGRST_JWT_SECRET")
	if !ok {
		log.Fatalln("No JWT secret found")
	}
	adminJwt := getAdminJwt(jwtSecret)

	backendUrl, ok := os.LookupEnv("POSTGREST_URL")
	if !ok {
		log.Fatalln("No PostgREST URL found")
	}

	logoId, err := save4tuLogoInDatabase(backendUrl, adminJwt)
	if err != nil {
		log.Fatalln("Error saving 4TU logo in database: " + err.Error())
	}

	//https://djehuty.4tu.nl/#x1-560005.1.1 for query parameters, including paging
	//const url4tu = "https://data.4tu.nl/v3/codemeta?modified_since=2024-01-01T00:00:00&limit=100"
	const url4tu = "https://data.4tu.nl/v3/codemeta?limit=1500"

	log.Println("Scraping 4TU API")
	bodyBytes, err := utils.GetAndReadBody(url4tu)
	log.Println("Done scraping 4TU API")

	if err != nil {
		log.Fatalln(err)
	}

	items := []terms.SoftwareApplication{}

	err = json.Unmarshal(bodyBytes, &items)
	if err != nil {
		log.Fatalln(err)
	}

	fourTuCommunityId, err := get4tuCommunityId(backendUrl)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Processing and saving software in RSD")
	err = saveApplicationsInRsd(items, adminJwt, backendUrl, fourTuCommunityId, logoId)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Done processing and saving software in RSD")

	log.Println("Done with 4TU scraper")
}

func save4tuLogoInDatabase(backendUrl string, adminJwt string) (string, error) {
	//fileData, err := os.ReadFile("./src/scrapers/4tu-logo.png")
	//if err != nil {
	//	return "", err
	//}

	base64Encoder := base64.StdEncoding.WithPadding(base64.StdPadding)
	fileDataBase64EncodedBytes := make([]byte, base64Encoder.EncodedLen(len(fourTuLogoBytes)))
	base64Encoder.Encode(fileDataBase64EncodedBytes, fourTuLogoBytes)
	fileDataBase64Encoded := string(fileDataBase64EncodedBytes)

	type rsdImage struct {
		Data     string `json:"data"`
		MimeType string `json:"mime_type"`
	}

	imageData := rsdImage{fileDataBase64Encoded, "image/png"}
	jsonBytes, err := json.Marshal(&imageData)
	if err != nil {
		return "", err
	}

	request, err := http.NewRequest("POST", backendUrl+"/image?select=id", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	request.Header.Add("Prefer", "return=representation,resolution=ignore-duplicates")
	request.Header.Add("Accept", "application/vnd.pgrst.object+json")

	resp, err := defaultClient.Do(request)
	if err != nil {
		return "", err
	}

	// image already exists, get ID by mimicking SHA1 hash
	if resp.StatusCode == 406 {
		hasher := sha1.New()
		hasher.Write(fileDataBase64EncodedBytes)
		shaBytes := hasher.Sum(nil)
		return hex.EncodeToString(shaBytes), nil
	}
	if resp.StatusCode >= 400 {
		respBodyBytes, _ := io.ReadAll(resp.Body)
		responseBody := string(respBodyBytes)
		errorMessageUnformatted := "Error when uploading 4TU logo,\n got status code %d\n and got body:\n %s"
		errorMessageFormatted := fmt.Sprintf(errorMessageUnformatted, resp.StatusCode, responseBody)
		log.Println(errorMessageFormatted)

		return "", fmt.Errorf("got status code %d when uploading 4TU logo", resp.StatusCode)
	}

	responseBytes, err := utils.ReadBody(resp)
	if err != nil {
		return "", err
	}

	type response struct {
		Id string `json:"id"`
	}

	idContainer := response{}
	err = json.Unmarshal(responseBytes, &idContainer)
	if err != nil {
		return "", err
	}

	return idContainer.Id, nil
}

func get4tuCommunityId(backendUrl string) (*string, error) {
	communityUrl := backendUrl + "/community?slug=eq.4tu&select=id"
	request, err := http.NewRequest("GET", communityUrl, nil)
	if err != nil {
		return nil, err
	}

	resp, err := defaultClient.Do(request)
	if err != nil {
		return nil, err
	}

	bodyBytes, err := utils.ReadBody(resp)
	type response struct {
		Id string `json:"id"`
	}
	var responseContainer []response
	err = json.Unmarshal(bodyBytes, &responseContainer)
	if err != nil {
		return nil, err
	}

	if len(responseContainer) == 1 {
		return &responseContainer[0].Id, nil
	} else {
		return nil, nil
	}
}

type RsdSoftwareTable struct {
	IsPublished    bool    `json:"is_published"`
	Slug           string  `json:"slug"`
	BrandName      string  `json:"brand_name"`
	ConceptDoi     *string `json:"concept_doi"`
	Description    *string `json:"description"`
	ShortStatement *string `json:"short_statement"`
	GetStartedUrl  *string `json:"get_started_url"`
	ImageId        string  `json:"image_id"`
}

var nonLowerLetterOrDigit = regexp.MustCompile("[^a-z0-9]")
var multipleDashes = regexp.MustCompile("-{2,}")
var doiPattern = regexp.MustCompile("^10(\\.\\w+)+/\\S+$")

func nameToSlug(name string) string {
	lower := strings.ToLower(name)
	lowerWithDashes := nonLowerLetterOrDigit.ReplaceAllString(lower, "-")
	slug := multipleDashes.ReplaceAllString(lowerWithDashes, "-")
	slug = strings.TrimPrefix(slug, "-")
	slug = strings.TrimSuffix(slug, "-")
	slug = "4tu-" + slug
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

func extractShortStatement(description terms.SingleOrArray[string]) *string {
	if description.Single != nil {
		return nil
	} else if description.Array != nil {
		var array = description.Array
		if len(array) >= 2 {
			result := array[0]
			return &result
		}
	}

	return nil
}

func extractDescription(description terms.SingleOrArray[string]) *string {
	if description.Single != nil {
		result := *description.Single
		return &result
	} else if description.Array != nil {
		var array = description.Array
		if len(array) >= 2 {
			result := array[1]
			return &result
		} else if len(array) == 1 {
			result := array[0]
			return &result
		}
	}

	return nil
}

func saveApplicationsInRsd(softwareSlice []terms.SoftwareApplication, adminJwt string, backendUrl string, fourTuCommunityId *string, logoId string) error {
	var err error

	for _, software := range softwareSlice {
		if strings.HasPrefix(software.Name, "https://") || strings.HasPrefix(software.Name, "http://") {
			log.Println("Skipping entry because its title seems to be a URL: " + software.Name)
			continue
		}

		conceptDoi := extractConceptDoi(software.Id)
		var getStartedUrl *string = nil
		if conceptDoi != nil {
			getStartedUrlString := "https://doi.org/" + *conceptDoi
			getStartedUrl = &getStartedUrlString
		}

		rsdSoftware := RsdSoftwareTable{
			IsPublished:    true,
			Slug:           nameToSlug(software.Name),
			BrandName:      software.Name,
			ConceptDoi:     conceptDoi,
			Description:    extractDescription(software.Description),
			ShortStatement: extractShortStatement(software.Description),
			GetStartedUrl:  getStartedUrl,
			ImageId:        logoId,
		}

		id, localErr := createOrUpdateBasicSoftware(rsdSoftware, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		if fourTuCommunityId != nil {
			localErr = attachSoftwareToCommunity(id, *fourTuCommunityId, adminJwt, backendUrl)
			if localErr != nil {
				err = errors.Join(err, localErr)
				continue
			}
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

		localErr = saveReferencePublicationsForSoftware(id, software, adminJwt, backendUrl)
		if localErr != nil {
			err = errors.Join(err, localErr)
			continue
		}

		localErr = savePackageManagersForSoftware(id, software, adminJwt, backendUrl)
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
	conceptDoiUrlEscaped := url.QueryEscape(conceptDoi)
	request, err := http.NewRequest("GET", backendUrl+"/software?select=id&concept_doi=eq."+conceptDoiUrlEscaped, nil)
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
			respBodyBytes, _ := io.ReadAll(resp.Body)
			responseBody := string(respBodyBytes)
			errorMessageUnformatted := "Error when creating new software with name %s,\n slug %s,\n got status code %d\n and got body:\n %s"
			errorMessageFormatted := fmt.Sprintf(errorMessageUnformatted, rsdSoftware.BrandName, rsdSoftware.Slug, resp.StatusCode, responseBody)
			log.Println(errorMessageFormatted)

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
			respBodyBytes, _ := io.ReadAll(resp.Body)
			responseBody := string(respBodyBytes)
			errorMessageUnformatted := "Error when updating existing software with name %s,\n slug %s,\n got status code %d\n and got body:\n %s"
			errorMessageFormatted := fmt.Sprintf(errorMessageUnformatted, rsdSoftware.BrandName, rsdSoftware.Slug, resp.StatusCode, responseBody)
			log.Println(errorMessageFormatted)

			return "", fmt.Errorf("got status code %d when updating existing software", resp.StatusCode)
		}

		return id, nil
	}
}

func attachSoftwareToCommunity(softwareId string, communityId string, adminJwt string, backendUrl string) error {
	body := fmt.Sprintf("{\"software\": \"%s\", \"community\": \"%s\", \"status\": \"approved\"}", softwareId, communityId)
	request, err := http.NewRequest("POST", backendUrl+"/software_for_community", strings.NewReader(body))
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	request.Header.Add("Prefer", "resolution=ignore-duplicates")
	_, err = defaultClient.Do(request)

	return err
}

func saveKeywordsForSoftware(id string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	var err error
	var multipleWhiteSpaceRegexp = regexp.MustCompile("\\s{2,}")
	for _, keyword := range software.Keywords {
		keywordTrimmed := strings.TrimSpace(keyword)
		keywordNoDoubleSpaces := multipleWhiteSpaceRegexp.ReplaceAllLiteralString(keywordTrimmed, " ")
		keywordQueryEscaped := url.QueryEscape(keywordNoDoubleSpaces)

		request, localErr := http.NewRequest("GET", backendUrl+"/keyword?value=eq."+keywordQueryEscaped, nil)
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
			body := "{\"value\": \"" + keywordNoDoubleSpaces + "\"}"
			request, localErr = http.NewRequest("POST", backendUrl+"/keyword?select=id", strings.NewReader(body))
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
		request.Header.Add("Prefer", "resolution=ignore-duplicates")

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

		familyName := person.FamilyName
		givenName := person.GivenName
		if familyName == "" && givenName == "" {
			name := person.Name
			if name == "" {
				log.Println("Skipping contributor without name")
				continue
			}
			split := strings.SplitN(name, " ", 2)
			if len(split) <= 1 {
				log.Println("Skipping contributor without family and given name, full name is: " + name)
				continue
			}
			familyName = split[1]
			givenName = split[0]
		}

		contributor := rsdContributor{
			Software:     id,
			FamilyNames:  familyName,
			GivenNames:   givenName,
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
	if software.CodeRepository == nil {
		request, err := http.NewRequest("DELETE", backendUrl+"/repository_url?software=eq."+id, nil)
		if err != nil {
			return err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)
		_, err = defaultClient.Do(request)
		return err
	}

	type rsdRepositoryUrl struct {
		Software     string `json:"software"`
		Url          string `json:"url"`
		CodePlatform string `json:"code_platform"`
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

	request, err := http.NewRequest("POST", backendUrl+"/repository_url", bytes.NewReader(body))
	if err != nil {
		return err
	}

	request.Header.Add("Authorization", "Bearer "+adminJwt)
	request.Header.Add("Prefer", "resolution=merge-duplicates")
	_, err = defaultClient.Do(request)
	if err != nil {
		return err
	}

	return nil
}

func saveReferencePublicationsForSoftware(softwareId string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	for _, article := range software.ReferencePublication {
		// TODO: also save reference publications without DOI
		if article.Id == nil {
			continue
		}

		var doi = *article.Id
		if !doiPattern.MatchString(doi) {
			fmt.Printf("Invalid DOI: %s\n", doi)
			return nil
		}

		request, err := http.NewRequest("GET", backendUrl+"/mention?select=id&doi=eq."+url.QueryEscape(doi), nil)
		if err != nil {
			return err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)
		_, err = defaultClient.Do(request)
		if err != nil {
			return err
		}

		resp, err := defaultClient.Do(request)
		if err != nil {
			return err
		}

		bodyBytes, err := utils.ReadBody(resp)
		type mentionIdResponse struct {
			Id string `json:"id"`
		}
		var responseContainer []mentionIdResponse
		err = json.Unmarshal(bodyBytes, &responseContainer)
		if err != nil {
			return err
		}

		// multiple mentions exist with concept DOI, this should never happen, don't know how to continue, error
		if len(responseContainer) >= 2 {
			return fmt.Errorf("multiple mentions found for concept DOI %v", doi)
		}

		if len(responseContainer) == 0 {
			type RsdMention struct {
				Doi         string  `json:"doi"`
				Title       string  `json:"title"`
				Page        *string `json:"page"`
				Url         *string `json:"url"`
				MentionType string  `json:"mention_type"`
				Source      string  `json:"source"`
			}

			var rsdMention = RsdMention{
				Doi:         doi,
				Title:       article.Name,
				Page:        article.Pagination,
				Url:         article.Url,
				MentionType: "other",
				Source:      "4TU scraper",
			}
			jsonBytes, err := json.Marshal(&rsdMention)
			if err != nil {
				return err
			}

			request, err = http.NewRequest("POST", backendUrl+"/mention?select=id", bytes.NewBuffer(jsonBytes))
			if err != nil {
				return err
			}

			request.Header.Add("Authorization", "Bearer "+adminJwt)
			request.Header.Add("Prefer", "return=representation")

			resp, err = defaultClient.Do(request)
			if err != nil {
				return err
			}

			respBytes, err := utils.ReadBody(resp)
			if err != nil {
				return err
			}

			err = json.Unmarshal(respBytes, &responseContainer)
			if err != nil {
				log.Println(string(respBytes))
				log.Println("ERROR")
				return err
			}
		}

		var mentionId = responseContainer[0].Id
		jsonBody := fmt.Sprintf("{\"software\": \"%v\", \"mention\": \"%v\"}", softwareId, mentionId)
		request, err = http.NewRequest("POST", backendUrl+"/reference_paper_for_software", strings.NewReader(jsonBody))
		if err != nil {
			return err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)
		request.Header.Add("Prefer", "resolution=ignore-duplicates")

		resp, err = defaultClient.Do(request)
		if err != nil {
			return err
		}
	}

	return nil
}

func savePackageManagersForSoftware(softwareId string, software terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	for _, downloadUrl := range software.DownloadUrl {

		type RsdPackageManager struct {
			Software       string `json:"software"`
			Url            string `json:"url"`
			PackageManager string `json:"package_manager"`
		}

		var rsdpackageManager = RsdPackageManager{
			Software:       softwareId,
			Url:            downloadUrl,
			PackageManager: "fourtu",
		}

		jsonBytes, err := json.Marshal(&rsdpackageManager)
		if err != nil {
			return err
		}

		request, err := http.NewRequest("POST", backendUrl+"/package_manager?on_conflict=software,url,package_manager", bytes.NewBuffer(jsonBytes))
		if err != nil {
			return err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)
		request.Header.Add("Prefer", "resolution=ignore-duplicates")

		_, err = defaultClient.Do(request)
		if err != nil {
			return err
		}
	}

	return nil
}
