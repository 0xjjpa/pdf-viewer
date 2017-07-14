export default class FileList extends React.Component {
  constructor(props) {
    super(props)
  }
  _printSize(size) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    let i = 0; while( size > 900 ) { size /= 1024; i++; }
    return `${(Math.round(size*100)/100)} ${sizes[i]}`
  }
  render() {
    const { files } = this.props;
    return (
      <div className="FileList">
          { 
            files.map( file => 
              (<div className="FileList__item" onClick={() => this.props.loadFile(file)}>
                <figure>📄 </figure>
                <h3>{file.name}<small>{this._printSize(file.size)}</small></h3>
              </div>))
          }
       </div>
    )
  }
}