import React, { Component } from 'react';
import './FileZone.css';
import { TS } from '../enum';


class FileZone extends Component {
  // Source: https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container
  getSelectionCharacterOffsetWithin = (element) => {
    var start = 0;
    var end = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            start = preCaretRange.toString().length;
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            end = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToStart", textRange);
        start = preCaretTextRange.text.length;
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        end = preCaretTextRange.text.length;
    }
    return { start: start, end: end };
  }


  getTextSelection = () => {
    const { onTextSelectionChange } = this.props;
    const node = document.getElementById('file');
    const { start, end } = this.getSelectionCharacterOffsetWithin(node);
    console.log('start, end', start, end);
    
    onTextSelectionChange(start, end);
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
