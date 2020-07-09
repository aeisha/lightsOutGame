import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { boardStyleClasses } from './classes';
import { injectIntl, withStyles } from 'utils/injectors';
import localized from 'cms/decorators/localized';
import Tile from './tile';
import { GAME_IDLE } from './constants';
import cx from 'classnames';

@withStyles(boardStyleClasses, { withTheme: true })
@injectIntl
@localized
export default class LightsOutBoard extends Component {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    styleClassMap: PropTypes.object.isRequired,
    gridSize: PropTypes.number.isRequired,
    image: PropTypes.object,
    isUsingImage: PropTypes.bool,
    isGameOver: PropTypes.bool,
    localized: PropTypes.func.isRequired,
    tileChangeClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const gameLevel = parseInt(props.gridSize, 10);

    this.state = {
      gameState: GAME_IDLE,
      gameLevel,
      moves: 0,
      imageNumber: 0,
    };
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.boards !== nextProps.boards ||
      this.props.styleClassMap !== nextProps.styleClassMap ||
      this.props.tileChangeClick !== nextProps.tileChangeClick ||
      this.props.image !== nextProps.image ||
      this.props.isUsingImage !== nextProps.isUsingImage ||
      this.props.isGameOver !== nextProps.isGameOver
    );
  }

  renderMobileInfo() {
    const {
      classes,
      image,
      localized,
      styleClassMap,
    } = this.props;

    return (
      (localized(image.title) !== '' || localized(image.description) !== '')
        ?
        <a
          className={classes.infoMobile}
          target="_blank"
          href={image.url}
        >
          <div id={'contentWrapper'} className={classes.infoMobileContentWrapper} >
            <div className={classes.infoContent}>
              <p className={cx(classes.infoContentTitle, styleClassMap.textTitle)}> {localized(image.title)} </p>
              <p className={cx(classes.infoContentDescription, styleClassMap.textDescription)}> {localized(image.description)} </p>
            </div>
          </div>
        </a>
        :
        <a className={classes.infoUrl} href={image.url} />
    );
  }

  renderDesktopInfo() {
    const {
      classes,
      image,
      localized,
      styleClassMap,
    } = this.props;

    return (
      (localized(image.title) !== '' || localized(image.description) !== '')
        ?
        <a
          className={classes.info}
          target="_blank"
          href={(image.url !== '') ? image.url : null
          }
        >
          <div className={classes.infoHeader}>
            <p id={'title'} className={cx(classes.infoHeaderTitle, styleClassMap.textTitle)}> {localized(image.title)} </p>
          </div>
          <div id={'contentWrapper'} className={classes.infoContentWrapper}>
            <div className={classes.infoContent}>
              <p className={cx(classes.infoContentTitle, styleClassMap.textTitle)}> {localized(image.title)} </p>
              <p className={styleClassMap.textDescription}> {localized(image.description)} </p>
            </div>
          </div>
        </a>
        :
        <a className={classes.infoUrl} href={image.url} />
    );
  }

  renderInfo() {
    const { image, localized } = this.props;

    if (typeof image.title !== 'undefined' && localized(image.title) !== "" ||
      typeof image.description !== 'undefined' && localized(image.description) !== "" ||
      typeof image.url !== 'undefined' && localized(image.url) !== "") {
      if (window.innerWidth <= 910) {
        return this.renderMobileInfo();
      } else {
        return this.renderDesktopInfo();
      }
    }
    return null;
  }


  render() {
    const {
      classes,
      isUsingImage,
      gridSize,
      styleClassMap,
      image,
      isGameOver,
      tileChangeClick,
    } = this.props;

    return (
      <div className={classes.board}>
        <div className={classes.switchContainer}>
          { this.props.boards.map((rowItem, rowIdx) => {
            return (
              <div
                key={`rowItem${rowIdx}`}
                className={cx(classes.switch, (!isUsingImage || !isGameOver) ? classes.switchPadding : null)}
              >
                <div>
                  { rowItem.map((cellItem, cellIdx) => {
                    return (
                      <Tile
                        key={`${(rowIdx * 5) + cellIdx}`}
                        isUsingImage={isUsingImage}
                        styleClassMap={styleClassMap}
                        gridSize={gridSize}
                        number={(rowIdx * 5) + cellIdx}
                        image={image}
                        isGameOver={isGameOver}
                        isVisible={cellItem.number < gridSize ** 2}
                        onClick={() => tileChangeClick(rowIdx, cellIdx)}
                        tileClass={Boolean(cellItem)}
                      >
                      </Tile>
                    );
                  })}
                </div>
              </div>
            );
          })}
          { isGameOver && image && image.image && this.renderInfo() }
          </div>
      </div>
    );
  }
}
