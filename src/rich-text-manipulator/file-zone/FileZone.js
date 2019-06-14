import React, { Component } from 'react';
import './FileZone.css';
import { TS } from '../enum';


class FileZone extends Component {

  getTextSelection = () => {
    const { onTextSelectionChange } = this.props;
    const selection = window.getSelection().getRangeAt(0);
    if (selection) {
      console.log(selection);
      onTextSelectionChange(selection.startOffset, selection.endOffset);
    }
  }

  getCssStyles = (styles) => {
    let cssStyles = '';
    if (styles & TS.BOLD) cssStyles = cssStyles.concat('font-weight: bold; ');
    if (styles & TS.ITALIC) cssStyles = cssStyles.concat('font-style: italic; ');
    if (styles & TS.UNDERLINE) cssStyles = cssStyles.concat('text-decoration: underline; ');
    return cssStyles;
  }

  openSpanWithStyle = (styles) => `<span style="${this.getCssStyles(styles)}">`

  generateHtml = () => {
    const { textArray, textStyles } = this.props;
    let htmlString = '';
    const openSpan = '<span>';
    const closeSpan = '</span>';

    // Initial span tag
    htmlString = htmlString.concat(openSpan);

    let previousStyles;
    for (let i = 0 ; i < textArray.length ; i++) {
      const currentStyles = textStyles[i];

      // If the styles are the same, we just push the current character
      if (currentStyles === previousStyles) {
        htmlString = htmlString.concat(textArray[i]);
      } else {
        // Otherwise we close the current span
        // (if it's the first character we do not have to close a span tag)
        if (i !== 0) htmlString = htmlString.concat(closeSpan);
        
        // Open a span with new styles
        htmlString = htmlString.concat(this.openSpanWithStyle(currentStyles));
        
        // And push the character
        htmlString = htmlString.concat(textArray[i]);
      }

      // Update previous styles
      previousStyles = currentStyles;
    }

    // Close last styled span
    htmlString = htmlString.concat(closeSpan);


    htmlString = htmlString.concat('2 <b>4 6</b> <u>8</u>');
    // Final span tag
    htmlString = htmlString.concat(closeSpan);

    return htmlString;
  }

  render = () => {
    return (
      <div id="file-zone">
        <div 
          id="file" 
          onMouseUp={this.getTextSelection}
          onDoubleClick={this.getTextSelection}
          dangerouslySetInnerHTML={{
            __html: this.generateHtml()
          }}
        />
      </div>
    );
  }
}

export default FileZone;
