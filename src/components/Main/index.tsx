import React from 'react';
import CSVFormatter from '../../CSVFormatter';
import CSVFormatterError from '../../CSVFormatter/error';
import { download } from '../../utils/download';
import FileInput from '../FileInput';
import { MainState } from './types'

export default class Main extends React.PureComponent<{}, MainState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      parseError: false,
    }
  }
  handleSetFile = (file: File) => {
    this.setState({ file, parseError: false });
  }

  handleSubmit = async (): Promise<void> => {
    const { file } = this.state;
    try {
      const resultsAsCsv = await CSVFormatter.parseAndFormat(file!)
      const newFile = new File([resultsAsCsv], 'gatheredNames.csv', {type: 'text/csv'});
      const url = URL.createObjectURL(newFile);
      download(url, newFile.name);
    } catch (error: any) {
      if (error.name === CSVFormatterError.NAME) {
        this.setState({ parseError: true })
        return;
      }
      throw error;
    }
  }

  determineFormValid = (): { valid: boolean; errorMessage?: string } => {
    const { file, parseError } = this.state;
    if (!file) {
      return { valid: false };
    }

    if (!!parseError) {
      return {
        valid: false,
        errorMessage: 'Something went wrong when parsing the file. Ensure the file is a valid CSV file.'
      };
    }
    return { valid: true };
  }

  render = () => {
    const formValidation = this.determineFormValid();
    return (
      <div className="col-lg-8 mx-auto p-3 py-md-5">
        <header className="d-flex align-items-center pb-3 mb-5 border-bottom">
          <span className="fs-4">CSV Name Gatherer</span>
        </header>
  
        <main>
          <h4>Upload a CSV file here to format</h4>
          <p className="fs-6 col-md-8">Click upload your CSV below and then click the format button.</p>
          <div className="mb-4">
            <FileInput setFile={this.handleSetFile} />
          </div>
          {formValidation.errorMessage &&
            <p className="text-danger" data-testid="errorMessage">{formValidation.errorMessage}</p>
          }
          <button 
            onClick={this.handleSubmit}
            className={`btn ${formValidation.valid ? 'btn-primary': 'btn-secondary'}`} 
            data-testid="formSubmitButton"
            disabled={!formValidation.valid}>
              Format CSV
          </button>
        </main>
      </div>
    );
  }
}
