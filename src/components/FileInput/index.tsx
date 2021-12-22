import React from 'react'
import { FileInputProps, FileInputState } from './types';

export default class FileInput extends React.PureComponent<FileInputProps, FileInputState> {
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void  => {
    const { setFile } = this.props;
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0]
      setFile(file)
  }

  render(): React.ReactNode {
    return (
      <input 
        type="file" 
        data-testid="fileInput" 
        className="form-control-file" 
        id="csvFileUpload" 
        onChange={this.handleFileChange} />
    )
  }
}
