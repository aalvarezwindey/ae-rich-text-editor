import React, { Component } from 'react';
import './ControlPanel.css';
import { TS } from '../enum';

class ControlPanel extends Component {
  toggleBitFlag = (flag) => () => {
    const { stylesApplied, onApplyStyles } = this.props;

    if (stylesApplied & flag) onApplyStyles(stylesApplied & (~flag)); // Unset
    else onApplyStyles(stylesApplied | flag) // Set
  }

  render = () => {
    const { stylesApplied } = this.props;
    return (
      <div id="control-panel">
        <div id="format-actions">
          <button 
            className="format-action" 
            type="button"
            style={{
              borderStyle: stylesApplied & TS.BOLD ? 'inset' : undefined,
            }}
            onClick={this.toggleBitFlag(TS.BOLD)}
          >
            <b>B</b>
          </button>
          
          <button 
            className="format-action" 
            type="button"
            style={{
              borderStyle: stylesApplied & TS.ITALIC ? 'inset' : undefined,
            }}
            onClick={this.toggleBitFlag(TS.ITALIC)}
          >
            <i>I</i>
          </button>

          <button 
            className="format-action" 
            type="button"
            style={{
              borderStyle: stylesApplied & TS.UNDERLINE ? 'inset' : undefined,
            }}
            onClick={this.toggleBitFlag(TS.UNDERLINE)}
          >
            <u>U</u>
          </button>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
