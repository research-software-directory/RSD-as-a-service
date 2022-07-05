import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/layout/AppFooter'

export default function PrivacyPolicyPage(){
  return (
    <>
      <AppHeader/>
      <main className="flex-1 bg-secondary">
        <article className="flex flex-col flex-1 px-4 overflow-hidden lg:container lg:mx-auto">
          <h1 className="py-8 text-white">Privacy policy</h1>
          <div className='flex h-[10rem] my-8'>
            <img
              src="https://maggiebrennan.com/press/img/underconstruction.gif"
              alt="under construction"
              height="160px"
              width="160px"
            />
          </div>
        </article>
      </main>
      <AppFooter/>
    </>
  )
}
