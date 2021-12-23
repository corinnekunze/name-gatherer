import React from 'react';
import CSVFormatter from '../../CSVFormatter';
import { download } from '../../utils/download';
import FileInput from '../FileInput';
import { MainState } from './types'

export default class Main extends React.PureComponent<{}, MainState> {
  constructor(props: {}) {
    super(props)
    this.state = {
    }
  }
  handleSetFile = (file: File) => {
    this.setState({ file });
  }

  handleSubmit = async (): Promise<void> => {
    const { file } = this.state;
    const resultsAsCsv = await CSVFormatter.parseAndFormat(file!)
    const newFile = new File([resultsAsCsv], 'gatheredNames.csv', {type: 'text/csv'});
    const url = URL.createObjectURL(newFile);
    download(url, newFile.name);
  }

  determineFormValid = (): { valid: boolean; errorMessage?: string } => {
    const { file } = this.state;
    if (!file) {
      return { valid: false };
    }
    if (file.type === 'text/csv') {
      return { valid: true };
    }
    return { valid: false, errorMessage: 'File is not a valid CSV'};
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
