/* eslint-disable testing-library/prefer-screen-queries */
import { findByTestId, fireEvent, getByTestId, queryByTestId, render } from "@testing-library/react"
import Main from ".."

describe('Main', () => {

  it('starts with disabled button', () => {
    const { container } = render(<Main />)
    const submitButton = getByTestId(container, 'formSubmitButton')
    expect(submitButton).toBeDisabled()
  })

  it('shows error in the case of a non CSV file', async () => {
    const file = new File(['(⌐□_□)'], 'file.xml', { type: 'application/xml' });
    const { container } = render(<Main />)
    const fileInput = getByTestId(container,'fileInput')
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });
    const submitButton = getByTestId(container, 'formSubmitButton')
    fireEvent.click(submitButton)
    const errorMessage = await findByTestId(container, 'errorMessage')
    expect(errorMessage).toBeInTheDocument()
  })

  it('does not show error in the case of a CSV file', async () => {
    const file = new File(['1,3,5'], 'file.csv', { type: 'text/csv' });
    const { container } = render(<Main />)
    const fileInput = getByTestId(container,'fileInput')
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });
    const submitButton = getByTestId(container, 'formSubmitButton')
    fireEvent.click(submitButton)
    const errorMessage = queryByTestId(container, 'errorMessage')
    expect(errorMessage).not.toBeInTheDocument()
  })
})
