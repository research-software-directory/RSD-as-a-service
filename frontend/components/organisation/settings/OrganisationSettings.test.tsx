import {render, screen, act} from '@testing-library/react'

import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {defaultSession} from '~/auth'

import OrganisationSettings from './index'

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

it('shows 401 when no token provided', async() => {
  render(<OrganisationSettings {...dummyProps} />)
  // act is used to wait on (async) state updates
  // eg. when useEffect is used to update local state etc.
  await act(() => {
    const msg401 = screen.getByRole('heading', {
      name:'401'
    })
    expect(msg401).toBeInTheDocument()
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
      OrganisationSettings, {
        props: dummyProps,
        session: defaultSession
      }
    )
  )
  await act(() => {
    const msg403 = screen.getByRole('heading', {
      name:'403'
    })
    expect(msg403).toBeInTheDocument()
  })
})

it('shows settings form with the name of dummy organisation', async() => {
  // user is authenticated
  defaultSession.status = 'authenticated'
  defaultSession.token = 'test-token'
  dummyProps.isMaintainer = true
  render(
    WrappedComponentWithProps(
      OrganisationSettings, {
        props: dummyProps,
        session: defaultSession
      }
    )
  )
  await act(() => {
    const nameInput = screen.getByRole('textbox', {
      name:'Name'
    })
    expect(nameInput).toBeInTheDocument()
    expect((nameInput as HTMLInputElement).value).toBe(dummyProps.organisation.name)
  })
})
