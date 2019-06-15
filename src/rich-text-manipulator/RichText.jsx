import React, { Component } from 'react';
import ControlPanel from "./control-panel/ControlPanel";
import FileZone from "./file-zone/FileZone";
import getMockText from './../text.service';
import { TS } from './enum';
import SynonymMaker from './synonym/SynonymMaker';

class RichText extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        textSelection: {
          start: 0,
          end: 0,
        },
        textArray: [],
        textStringSelected: '',
        textStyles: [],
        stylesApplied: TS.NONE,
      }
    }

    componentDidMount = () => {
      getMockText().then((result) => {
        this.setState({ 
          textArray: Array.from(result),
          textStyles: new Array(result.length).fill(TS.NONE)
        });
      });
    }

    getTextStringSelected = (start, end) => {
      if (start === end) return undefined;
      const str = this.state.textArray.slice(start, end).join('');
      return str;
    }

    handleTextSelectionChange = (start, end) => {
      // console.log('start, end', start, end);
      const { textStyles } = this.state;
      this.setState({ 
        textSelection: {
          start,
          end
        },
        stylesApplied: textStyles[start], // We use the start index as Gmail rich text editor
        textStringSelected: this.getTextStringSelected(start, end)
      });
    }

    removeStyle = (currentStyles, style) => currentStyles & (~style)
    addStyle = (currentStyles, style) => currentStyles | style

    handleStylesChange = (processStyle) => (style) => {
      const { start, end } = this.state.textSelection;
      const { textStyles } = this.state;
      if (start === end) return; // We ignore if there is no text selection

      for (let i = start ; i < end ; i++) {
        textStyles[i] = processStyle(textStyles[i], style);
      }

      this.setState({ 
        // We remove text selection
        textSelection: {
          start: 0,
          end: 0,
        },
        textStyles,
        stylesApplied: textStyles[textStyles.length]
      });
    }

    handleSynonymReplace = (synonym) => {
      const { start, end } = this.state.textSelection;
      const { textArray, textStyles } = this.state;
      const synonymArr = Array.from(synonym);
      let newTextArray = [];
      let newTextStyles = [];

      // Copy first part of array
      for (let i = 0 ; i < start ; i++) {
        newTextArray[i] = textArray[i];
        newTextStyles[i] = textStyles[i];
      }

      // Copy the synonym
      for (let i = start ; i < start + synonymArr.length ; i++) {
        newTextArray[i] = synonymArr[i - start];

        // we use the first styles as default
        newTextStyles[i] = textStyles[start];
      }

      // Copy the rest of array
      const originalLength = end - start;
      const diffBetweenSynonymAndOriginal = synonymArr.length - originalLength;
      for (let i = end ; i < textArray.length ; i++) {
        newTextArray[i + diffBetweenSynonymAndOriginal] = textArray[i];
        newTextStyles[i + diffBetweenSynonymAndOriginal] = textStyles[i];
      }

      this.setState({
        textArray: newTextArray,
        textStyles: newTextStyles,
        textStringSelected: undefined
      })
    }

    render() {
      return (
        <main>
          <ControlPanel
            stylesApplied={this.state.stylesApplied}
            onAddStyle={this.handleStylesChange(this.addStyle)}
            onRemoveStyle={this.handleStylesChange(this.removeStyle)}
          />
          <FileZone
            textArray={this.state.textArray}
            textStyles={this.state.textStyles}
            onTextSelectionChange={this.handleTextSelectionChange}
          />
          <SynonymMaker 
            text={this.state.textStringSelected}
            onReplace={this.handleSynonymReplace}
          />
        </main>
      );
    }
}

export default RichText;
