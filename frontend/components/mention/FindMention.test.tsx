
import {render, screen, fireEvent, waitFor, waitForElementToBeRemoved, act} from '@testing-library/react'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import FindMention from './FindMention'

// default is non-resolved promise - for first test
const mockSearchFn = jest.fn((props) => new Promise<MentionItemProps[]>((res, rej) => {}))
const mockAdd = jest.fn()
const mockCreate = jest.fn()

const props = {
  config: {
    freeSolo: true,
    minLength: 3,
    label: 'Test label',
    help: 'Test help',
    reset: true
  },
  searchFn: mockSearchFn,
  onAdd: mockAdd,
  onCreate: mockCreate
}

beforeAll(() => {
  jest.useFakeTimers()
})

it('has cancel button when freeSolo', async() => {
  const searchFor = 'test string'
  // render component
  render(<FindMention {...props} />)
  // input test value
  const searchInput = screen.getByRole('combobox')
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  const cancelBtn = screen.getByRole('button', {hidden:true})
  expect(cancelBtn).toBeInTheDocument()
  expect(cancelBtn.getAttribute('title')).toEqual('Cancel')

  // press the button
  fireEvent.click(cancelBtn)

})

it('shows custom notFound message when freeSolo AND onCreate NOT provided', async() => {
  // prepare
  jest.useFakeTimers()
  // custom props
  const props = {
    config: {
      freeSolo: true,
      minLength: 3,
      label: 'Test label',
      help: 'Test help',
      reset: true,
      noOptions: {
        notFound: 'Tested not found message',
        empty: 'Not tested',
        minLength: 'Not tested'
      }
    },
    searchFn: mockSearchFn,
    onAdd: mockAdd
  }
  // resolve with no options
  mockSearchFn.mockResolvedValueOnce([])

  // render component
  render(<FindMention {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

  // wait for listbox and notFound message
  await waitFor(() => {
    const options = screen.getByRole('listbox')
    expect(options).toBeInTheDocument()
    const notFound = screen.getByText(props.config.noOptions.notFound)
    expect(notFound).toBeInTheDocument()
  })
})

describe('reset functionality', () => {
  // custom props
  const props = {
    config: {
      freeSolo: true,
      minLength: 3,
      label: 'Test label',
      help: 'Test help',
      reset: true,
      noOptions: {
        notFound: 'Tested not found message',
        empty: 'Not tested',
        minLength: 'Not tested'
      }
    },
    searchFn: mockSearchFn,
    onAdd: mockAdd
  }
  const mockMentionItem = {
    id: '1',
    doi: 'doi-test',
    url: 'url-test',
    title: 'test-title',
    authors: 'test-authors',
    publisher: 'test-publisher',
    publication_year: 2020,
    page: null,
    // url to external image
    image_url: null,
    // is_featured?: boolean
    mention_type: 'book' as MentionTypeKeys,
    source: 'crossref'
  }

  beforeEach(() => {
    // prepare
    jest.useFakeTimers()
    // resolve with no options
    mockSearchFn.mockResolvedValueOnce([mockMentionItem,mockMentionItem])
  })

  it('removes input after selection when reset=true', async () => {
    // render component
    render(<FindMention {...props} />)
    // input test value
    const searchInput = screen.getByRole('combobox')
    const searchFor = 'test'
    fireEvent.change(searchInput, {target: {value: searchFor}})
    // need to advance all timers for debounce etc...
    // Note! it needs to be wrapped in act
    act(() => {
      jest.runAllTimers()
    })

    // then wait for loader to be removed
    await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))
    const options = screen.getAllByRole('option')
    expect(options.length).toEqual(2)

    // select option
    fireEvent.click(options[0])
    // exper input to be reset
    expect(searchInput).toHaveValue('')
  })

  it('leaves input after selection when reset=false', async () => {
    // SET RESET TO FALSE
    props.config.reset=false
    // render component
    render(<FindMention {...props} />)
    // input test value
    const searchInput = screen.getByRole('combobox')
    const searchFor = 'test'
    fireEvent.change(searchInput, {target: {value: searchFor}})

    // need to advance all timers for debounce etc...
    // Note! it needs to be wrapped in act
    act(() => {
      jest.runAllTimers()
    })

    // then wait for loader to be removed
    await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

    // select only option in dropdown
    const options = screen.getAllByRole('option')
    expect(options.length).toEqual(2)

    // click on the option
    fireEvent.click(options[0])

    // expect input to be preset
    expect(searchInput).toHaveValue(searchFor)
  })
})
