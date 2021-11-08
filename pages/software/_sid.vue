<template>
  <section class="p-20 container mx-auto">
    <h1 class="text-3xl pb-4">
      Software specific page
    </h1>

    <h2 class="text-xl pb-4">
      Software id {{ $route.params.sid }}
    </h2>
    <p class="py-12 text-red-500">
      Test page for adding software specific meta tags.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora consectetur obcaecati, magni assumenda facere atque accusamus reprehenderit fuga, laboriosam quos nihil quis, laborum sequi. Quod rerum ratione officia iure id vero? Tenetur assumenda aut delectus sed corrupti repellat laudantium ab nostrum architecto voluptatum, officiis, quae dolorum? Quos, quis totam. Sunt incidunt consequatur quasi voluptate architecto, est ullam quod ea quibusdam sapiente corrupti harum vero reprehenderit maiores omnis porro. Vel perspiciatis, quos consequatur cumque dignissimos consectetur neque officia quis delectus est. Amet blanditiis facere fugiat cupiditate hic. Nostrum eum hic asperiores, accusantium eveniet ab quibusdam voluptate sequi autem consequuntur enim quidem.
    </p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import metaInfo from '~/utils/metaInfo'
import { ogMeta, twitterMeta, canonicalUrl, citationMeta } from '~/utils/metaTags'
import { breadcrumbList, softwareSourceCode } from '~/utils/jsonLD'
export default Vue.extend({
  head () {
    // Page specific head items
    // On the software page we have more meta info
    // to support search engine crawling
    return {
      title: `Software | ${metaInfo.appName}`,
      meta: [
        // meta description
        { description: 'This is description', hid: 'description' },
        // og meta tags (social media)
        // TODO: page id in url should be variable
        // title & description should come from ayncData (SSR)
        ...ogMeta({
          url: `${metaInfo.baseUrl}/software/1`,
          title: 'Specific software page',
          description: 'This description comes from data',
          imageUrl: undefined
        }),
        // twitter meta tags
        // TODO: page id in url should be variable
        ...twitterMeta({
          user: 'This user',
          url: `${metaInfo.baseUrl}/software/1`,
          title: 'Specific software page',
          description: 'This description comes from data',
          imageUrl: undefined
        }),
        // citation meta
        // TODO: check where and how this meta is used
        ...citationMeta({
          title: 'Software title from db',
          author: 'Author name from db',
          publicationDate: '2021-11-01',
          doi: '10.5281/zenodo.1051064'
        })
      ],
      script: [
        // Software type is not recognized by Google
        // https://search.google.com/test/rich-results/result?id=Y80kwY7VsEP6pdPCAvcyHw
        // We also use graph type as we have more than one item
        {
          type: 'application/ld+json',
          json: {
            '@context': 'http://schema.org',
            '@graph': [
              breadcrumbList({ id: '1', name: 'Software name here' }),
              softwareSourceCode()
            ]
          }
        }
      ],
      link: [
        canonicalUrl()
      ]
    }
  }
})
</script>
