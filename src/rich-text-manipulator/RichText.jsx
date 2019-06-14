import React, { Component } from 'react';
import ControlPanel from "./control-panel/ControlPanel";
import FileZone from "./file-zone/FileZone";
import getMockText from './../text.service';
import { TS } from './enum';

class RichText extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        textSelection: {
          start: 0,
          end: 0,
        },
        textArray: [],
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

    handleTextSelectionChange = (start, end) => {
      // console.log('start, end', start, end);
      const { textStyles } = this.state;
      this.setState({ 
        textSelection: {
          start,
          end
        },
        stylesApplied: textStyles[start], // We use the start index as Gmail rich text editor
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
        </main>
      );
    }
}

export default RichText;
