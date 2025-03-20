// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package terms

import (
	"bytes"
	"encoding/json"
)

func isJsonObject(byteSlice []byte) bool {
	trimmed := bytes.TrimLeft(byteSlice, "\t\r\n")

	return len(trimmed) > 0 && trimmed[0] == '{'
}

func isJsonArray(byteSlice []byte) bool {
	trimmed := bytes.TrimLeft(byteSlice, "\t\r\n")

	return len(trimmed) > 0 && trimmed[0] == '['
}

// SingleOrArray implements json.Marshaler
// SingleOrArray implements json.Unmarshaler
type SingleOrArray[T any] struct {
	Single *T
	Array  []T
}

func (singleOrArray SingleOrArray[T]) MarshalJSON() ([]byte, error) {
	if singleOrArray.Array != nil {
		return json.Marshal(singleOrArray.Array)
	} else if singleOrArray.Single != nil {
		return json.Marshal([]T{*singleOrArray.Single})
	} else {
		return json.Marshal(nil)
	}
}

func (singleOrArray *SingleOrArray[T]) UnmarshalJSON(byteSlice []byte) error {
	var err error = nil

	if isJsonArray(byteSlice) {
		err = json.Unmarshal(byteSlice, &singleOrArray.Array)
	} else {
		var t T
		err = json.Unmarshal(byteSlice, &t)
		singleOrArray.Single = &t
	}

	return err
}

type Organization struct {
	Type string `json:"@type"`
	Name string `json:"name"`
}

type Person struct {
	Type        string        `json:"@type"`
	Id          *string       `json:"@id"`
	GivenName   string        `json:"givenName"`
	FamilyName  string        `json:"familyName"`
	Name        string        `json:"name"`
	Email       *string       `json:"email"`
	RoleName    *string       `json:"roleName"`
	Affiliation *Organization `json:"affiliation"`
}

type CreativeWork struct {
	Type string `json:"@type"`
	Name string `json:"name"`
}

type CreativeWorkOrUrl struct {
	CreativeWork *CreativeWork
	Url          *string
}

func (creativeWorkOrUrl *CreativeWorkOrUrl) UnmarshalJSON(byteSlice []byte) error {
	var err error = nil

	if isJsonObject(byteSlice) {
		err = json.Unmarshal(byteSlice, creativeWorkOrUrl.CreativeWork)
	} else {
		s := ""
		err = json.Unmarshal(byteSlice, &s)
		creativeWorkOrUrl.Url = &s
	}

	return err
}

type ScholarlyArticle struct {
	Type       string  `json:"@type"`
	Id         *string `json:"@id"`
	Name       string  `json:"name"`
	Pagination *string `json:"pagination"`
	Url        *string `json:"url"`
}

type SoftwareApplication struct {
	Context              string                           `json:"@context"`
	Type                 string                           `json:"@type"`
	Id                   *string                          `json:"identifier"`
	Name                 string                           `json:"name"`
	Description          SingleOrArray[string]            `json:"description"`
	CodeRepository       *string                          `json:"codeRepository"`
	Author               []Person                         `json:"author"`
	Keywords             []string                         `json:"keywords"`
	ProgrammingLanguage  []string                         `json:"programmingLanguage"`
	License              SingleOrArray[CreativeWorkOrUrl] `json:"license"`
	ReferencePublication []ScholarlyArticle               `json:"referencePublication"`
	DownloadUrl          []string                         `json:"downloadUrl"`
}
