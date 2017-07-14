import { default as InputFile } from './components/inputfile'
import { default as FileList } from './components/filelist'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileReader: new FileReader(),
      files: [],
      pages: [],
      currentFile: null
    }
    this.state.fileReader.onload = this.loadFileReader.bind(this)
  }
  
  loadFileReader = e => {
    PDFJS.getDocument(new Uint8Array(e.target.result)).then(pdf => {
      // Hardcoded to match the current viewport
      let scale = 0.72;
      
      let viewport, canvas, context, renderContext;
      
      // This is a good example of why handling DOM directly w/React is a bad idea
      // Ideally we just use data and grab context from canvas using something like
      // <canvas ref={(c) => this.context = c.getContext('2d')} />
      // otherwise you need to manually keep track of DOM manipulations
      const pageContainer = this._pageContainer;
      let { pages } = this.state;
      pages.map( page => pageContainer.removeChild(page) )
      pages = []
      
      for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(page => {

          viewport = page.getViewport(scale);

          // Prepare canvas using PDF page dimensions.
          canvas = document.createElement("canvas");
          context = canvas.getContext('2d');
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context.
          renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          page.render(renderContext);
          pageContainer.appendChild(canvas)
          pages.push(canvas)
        }); 
      }
      this.setState({ pages })
    });
  }
  
  loadFile = file => {
    // Quick example of short-circuit evaluation
    file !== this.state.currentFile && (this.setState({ currentFile: file }) || this.state.fileReader.readAsArrayBuffer(file));
  }
  
  uploadFileHandler = e => {
    const { files } = this.state;
    const file = e.target.files[0]
    files.push( file );
    this.setState({ files });
    this.loadFile(file)
  }
  
  render() {
    let { files } = this.state;
    console.log("Files", files)
        console.log("Pages", this.state.pages)
    return (
      <div className="center">
        <div className="Sidebar">
        <InputFile uploadFileHandler={this.uploadFileHandler.bind(this)}>
          Select a PDF file
        </InputFile>
        <FileList files={files} loadFile={this.loadFile.bind(this)} />
        </div>
        <div className="Content">
          <h2 style={{ marginTop: 0, color: "#efefef" }}>Your PDF file will be viewed here.</h2>
          <div ref={c => this._pageContainer = c}></div>
        </div>
    	</div>)
  }

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);