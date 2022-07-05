import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/layout/AppFooter'

export default function TermsOfServicePage(){
  return (
    <>
      <AppHeader/>
      <main className="flex-1 bg-secondary">
        <article className="flex flex-col flex-1 px-4 overflow-hidden lg:container lg:mx-auto">
          <h1 className="py-8 text-white">Terms of service</h1>
        </article>
      </main>
      <AppFooter/>
    </>
  )
}
