// SPDX-FileCopyrightText: 2021 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.migration;

public record MentionRecord(String title, String author, String image_url, String mention_type, String url) {
}
