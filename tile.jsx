import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'utils/injectors';
import { tileStyleClasses } from './classes';
import cx from 'classnames';
import localized from 'cms/decorators/localized';


@withStyles(tileStyleClasses, { withTheme: true })
@localized({ copyStatics: ['defaultProps'] })
export default class Tile extends Component {
  static propTypes = {
    key: PropTypes.string,
    number: PropTypes.number,
    correct: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    isUsingImage: PropTypes.bool,
    styleClassMap: PropTypes.object,
    isGameOver: PropTypes.bool,
    localized: PropTypes.func.isRequired,
    image: PropTypes.object,
    gridSize: PropTypes.number.isRequired,
    tileClass: PropTypes.bool,
    onClick: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return (
      this.props.key !== nextProps.key ||
      this.props.image !== nextProps.image ||
      this.props.number !== nextProps.number ||
      this.props.classes !== nextProps.classes ||
      this.props.isUsingImage !== nextProps.isUsingImage ||
      this.props.styleClassMap !== nextProps.styleClassMap ||
      this.props.localized !== nextProps.localized ||
      this.props.gridSize !== nextProps.gridSize ||
      this.props.tileClass !== nextProps.tileClass ||
      this.props.isGameOver !== nextProps.isGameOver
    );
  }

  render() {
    const {
      classes,
      number,
      isGameOver,
      isUsingImage,
      styleClassMap,
      image,
      gridSize,
      tileClass,
      onClick,
    } = this.props;

    return (
      <div
        className={cx(
          classes.tileWrapper,
          (tileClass) ? styleClassMap.tiles : classes.tileOff,
          (!isGameOver) ? classes.tilePointer : null,
          (!isUsingImage || !isGameOver) ? classes.tileWrapperBorder : null,
        )}
        onClick={onClick}
      >
        { (image && image.image && isUsingImage) && (
          <img
            className={cx(classes.tileImage, (tileClass) ? classes.tileImage : classes.tileImageOff)}
            style={{
              width: `${gridSize * 100}%`,
              height: `${gridSize * 100}%`,
              margin: `-${((number) % gridSize << 0) * 100}% 0 0 -${Math.floor((number) / gridSize) * 100}%`,
            }}
            src={`/in/rest/annotationSVC/Attachment/${image.image}`}
            role="presentation"
          />
        )}
      </div>
    );
  }
}
