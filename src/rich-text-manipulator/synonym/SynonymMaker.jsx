import React from 'react'

class SynonymMaker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      synonim: '',
      instructions: true
    }
  }

  searchSynonymsForText = (text) => {
    this.setState({ fetching: true });
    fetch(`https://api.datamuse.com/words?ml=${text}`)
    .then(response => {
      if (response.status === 200) return response.json();
      else this.setState({ fetching: false, synonim: undefined });
    })
    .then(result => {
      // For now we just use only the first synonym
      if (result && result.length) {
        this.setState({ synonim: result[0].word, fetching: false });
      }
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.text !== this.props.text && nextProps.text) {
      this.setState({ instructions: false })
      this.searchSynonymsForText(nextProps.text);
    }

    if (!nextProps.text) {
      this.setState({ instructions: true, synonim: undefined })
    }
  }

  render = () => {
    const { onReplace } = this.props;
    const { fetching, synonim } = this.state;
    let content = fetching ? 'Searching synonym...' : synonim

    return (
      <div style={{
        marginTop: '20px',
        padding: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '600px',
        borderRadius: '25px',
        border: '2px solid gray'
      }}>
        <p>
          {content ? content : 'Select a piece of text to find synonyms'}
        </p>
        <button
          disabled={!Boolean(synonim)}
          onClick={() => onReplace(synonim)}
        >
          Replace
        </button>
      </div>
    );
  }
}

export default SynonymMaker