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
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	jwtSecret, ok := os.LookupEnv("PGRST_JWT_SECRET")
	if !ok {
		log.Fatal("No JWT secret found")
	}
	adminJwt := getAdminJwt(jwtSecret)
	println(adminJwt)

	backendUrl, ok := os.LookupEnv("POSTGREST_URL")
	if !ok {
		log.Fatal("No JWT secret found")
	}

	const url = "https://data.4tu.nl/v3/datasets/codemeta?modified_since=2024-03-04T10:54:30"

	bodyBytes, err := utils.GetAndReadBody(url)

	if err != nil {
		log.Fatal(err)
	}

	items := []terms.SoftwareApplication{}

	err = json.Unmarshal(bodyBytes, &items)
	if err != nil {
		log.Fatal(err)
	}

	//fmt.Println(items)

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

func nameToSlug(name string) string {
	lower := strings.ToLower(name)
	return strings.ReplaceAll(lower, " ", "-")
}

func saveApplicationsInRsd(softwareSlice []terms.SoftwareApplication, adminJwt string, backendUrl string) error {
	for _, software := range softwareSlice {
		rsdSoftware := RsdSoftwareTable{
			IsPublished: true,
			Slug:        nameToSlug(software.Name),
			BrandName:   software.Name,
			ConceptDoi:  software.Id,
			Description: nil,
		}

		fmt.Println(software)
		println(rsdSoftware.BrandName)
		println(rsdSoftware.Slug)

		jsonBytes, err := json.Marshal(&rsdSoftware)
		if err != nil {
			return err
		}

		request, err := http.NewRequest("POST", backendUrl+"/software", bytes.NewBuffer(jsonBytes))
		if err != nil {
			return err
		}

		request.Header.Add("Authorization", "Bearer "+adminJwt)

		var defaultClient = http.DefaultClient

		resp, err := defaultClient.Do(request)
		if err != nil {
			return err
		}

		println(resp.StatusCode)
		respBody, _ := io.ReadAll(resp.Body)
		println(string(respBody))
	}

	return nil
}
