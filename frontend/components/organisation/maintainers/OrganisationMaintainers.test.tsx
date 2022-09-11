import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'

import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {defaultSession} from '~/auth'
import OrganisationMaintainerPage from './index'


const dummyRawMaintainers= [{
  'maintainer': 'a050aaf3-9c46-490c-ade3-aeeb6a05b1d1',
  'name': ['Jordan Ross Belfort'],
  'email': ['Jordan.Belfort@harvard-example.edu'],
  'affiliation': ['harvard-example.edu'],
  'is_primary': false
}]

const getMaintainersOfOrganisation = jest.fn((props) => {
  // console.log('mocked...getMaintainersOfOrganisation...props...', props)
  return Promise.resolve(dummyRawMaintainers)
})

// Mock partially useOrganisationMaintainers
// we want to mock only api call getMaintainersOfOrganisation
jest.mock('./getMaintainersOfOrganisation', () => {
  return {
    // avoid 'cannot access before initialization Jest error
    // see https://www.bam.tech/article/fix-jest-mock-cannot-access-before-initialization-error
    getMaintainersOfOrganisation:jest.fn((props)=>getMaintainersOfOrganisation(props))
  }
})

const getUnusedInvitations = jest.fn((props) => {
  // console.log('mocked...getUnusedInvitations...props...', props)
  return Promise.resolve([])
})

// Mock
jest.mock('~/utils/getUnusedInvitations', () => {
  return {
    getUnusedInvitations:jest.fn((props)=>getUnusedInvitations(props))
  }
})

const dummyProps = {
  organisation: {
    'id': '8d72dfb5-8111-4863-a42a-e4538bbbd328',
    'slug': 'zboncak-and-sons',
    'parent': null,
    'primary_maintainer': null,
    'name': 'Zboncak and Sons',
    'ror_id': 'https://ror.org/57ZHV150',
    'website': 'http://gruesome-patio.name',
    'is_tenant': false,
    'rsd_path': 'zboncak-and-sons/',
    'logo_id': '8d72dfb5-8111-4863-a42a-e4538bbbd328',
    'software_cnt': 6,
    'project_cnt': 4,
    'children_cnt': 2,
    'score': 10
  },
  isMaintainer: true
}


beforeEach(() => {
  // reset mock counters
  jest.clearAllMocks()
})

it('shows 401 when no token provided', () => {
  render(<OrganisationMaintainerPage {...dummyProps} />)
  const msg401 = screen.getByRole('heading', {
    name:'401'
  })
  expect(msg401).toBeInTheDocument()
})

it('shows loader during api request', async() => {
  // user is authenticated
  defaultSession.status = 'authenticated'
  defaultSession.token = 'test-token'
  // but it is not maintainer of this organisation
  dummyProps.isMaintainer = false
  render(
    WrappedComponentWithProps(
      OrganisationMaintainerPage, {
        props: dummyProps,
        session: defaultSession
      }
    )
  )

  const loader = await screen.findByRole('progressbar')
  expect(loader).toBeInTheDocument()

  expect(getMaintainersOfOrganisation).toBeCalledTimes(1)
  expect(getMaintainersOfOrganisation).toBeCalledWith({
    organisation: dummyProps.organisation.id,
    token: defaultSession.token,
    frontend: true
  })
})


it('shows 403 when user is not organisation maintainer', async() => {
  // user is authenticated
  defaultSession.status = 'authenticated'
  defaultSession.token = 'test-token'
  // but it is not maintainer of this organisation
  dummyProps.isMaintainer = false
  render(
    WrappedComponentWithProps(
      OrganisationMaintainerPage, {
        props: dummyProps,
        session: defaultSession
      }
    )
  )
  const msg403 = await screen.findByRole('heading', {
    name:'403'
  })
  expect(msg403).toBeInTheDocument()
})

it('shows "No maintainers" message', async() => {
  // user is authenticated
  defaultSession.status = 'authenticated'
  defaultSession.token = 'test-token'
  // but it is not maintainer of this organisation
  dummyProps.isMaintainer = true

  // mock empty response array
  getMaintainersOfOrganisation.mockResolvedValueOnce([])

  render(
    WrappedComponentWithProps(
      OrganisationMaintainerPage, {
        props: dummyProps,
        session: defaultSession
      }
    )
  )
  const noMaintainers = await screen.findByText('No maintainers')
  expect(noMaintainers).toBeInTheDocument()
})

it('shows maintainer list item', async() => {
  // user is authenticated
  defaultSession.status = 'authenticated'
  defaultSession.token = 'test-token'
  // but it is not maintainer of this organisation
  dummyProps.isMaintainer = true

  render(
    WrappedComponentWithProps(
      OrganisationMaintainerPage, {
        props: dummyProps,
        session: defaultSession
      }
    )
  )

  await waitForElementToBeRemoved(()=>screen.getByRole('progressbar'))

  const maintainer = await screen.findByText(dummyRawMaintainers[0].name[0])
  expect(maintainer).toBeInTheDocument()
})
