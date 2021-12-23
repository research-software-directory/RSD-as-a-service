// based on one record
// http://localhost:3500/software?select=*,repository_url!left(url)&slug=eq.ggir
const rsdSoftwareItem = {
  'id': 'c7ef905a-94db-49fb-8980-4dba098ca9f7',
  'slug': 'ggir',
  'brand_name': 'GGIR',
  'bullets': '* GGIR is an R-package to process and analysis multi-day data collected with wearable raw data accelerometers for physical activity and sleep research.\n* GGIR uses this information to describe the data per day of measurement or per measurement, including estimates of physical activity, inactivity, and sleep. As part of the pipeline GGIR performs automatic signal calibration, detection of sustained abnormally high values, detection of sensor non-wear and calculation of average magnitude acceleration based on a variety of metrics.\n* GGIR is the only open source licensed software that provides a full pipeline for both physical activity and sleep analyses, with a high freedom for the user to configure the analyses to their needs.\n* The package has been used for domain science in 70+ publications, and is supported by 8 methodological publications.',
  'concept_doi': '10.5281/zenodo.1051064',
  'get_started_url': 'https://cran.r-project.org/web/packages/GGIR/vignettes/GGIR.html',
  'is_featured': true,
  'is_published': true,
  'read_more': 'The package has been developed and tested for binary data from GENEActiv and GENEA devices, .csv-export data from Actigraph devices, and .cwa and .wav-format data from Axivity. These devices are currently widely used in research on human daily physical activity.\n\nA list of publications using GGIR can be found here: https://github.com/wadpac/GGIR/wiki/Publication-list\n\nThe package vignette which gives a general introduction can be found here: https://cran.r-project.org/web/packages/GGIR/vignettes/GGIR.html.\n',
  'short_statement': 'Converts raw data from wearables into insightful reports for researchers investigating human daily physical activity and sleep.',
  'created_at': '2021-12-21T11:52:06.041581',
  'updated_at': '2021-12-21T11:52:06.041581',
  'repository_url': [
    {
      'url': 'https://github.com/wadpac/GGIR'
    }
  ]
}


export type SoftwareItem = typeof rsdSoftwareItem
