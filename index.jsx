import React, { Component } from 'react';
import PropTypes from 'prop-types';
import propsSchema from './props-schema';
import { withStyles, injectIntl, intlShape } from 'utils/injectors';
import settings from './settings';
import style from './style';
import LightsOutBoard from './lightsOutBoard';
import GameMenu from 'cms/components/game-menu/index';
import Paper from '@material-ui/core/Paper';
import { styleClasses } from './classes';
import localized from 'cms/decorators/localized';
import uuid from 'uuid';
import {
  LIGHTOUT_BOARDS,
  GAME_IDLE,
  GAME_OVER,
  GAME_STARTED,
  GAME_PAUSE,
} from './constants';

@injectIntl
@localized
@withStyles(styleClasses, { withTheme: true })
export default class LightsOutGame extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    classes: PropTypes.object.isRequired,
    Element: PropTypes.func.isRequired,
    localized: PropTypes.func.isRequired,
    relax: PropTypes.object.isRequired,
    styleClassMap: PropTypes.object,
    images: PropTypes.array,
    isMoveCounterDisplay: PropTypes.bool,
    isUsingImage: PropTypes.bool,
    textWin: PropTypes.object,
  };

  static defaultProps = {
    isMoveCounterDisplay: true,
    isUsingImage: false,
  };

  static propsSchema = propsSchema;
  static settings = settings;
  static style = style;


  constructor(props) {
    super(props);

    this.state = {
      boards: LIGHTOUT_BOARDS && LIGHTOUT_BOARDS[0].map(function (row) {
        return row.map(function (cell) {
          return cell;
        });
      }),
      boardId: uuid.v4(),
      board_original: 0,
      gameState: GAME_IDLE,
      moves: 0,
      gridSize: 5,
      imageNumber: 0,
      isGameRunning: false,
      isGameStarted: false,
      isPlayerWin: false,
    };
  }

  onClick = () => {
    if (this.state.gameState === GAME_OVER) {
      return;
    }

    this.setState({
      isGameStarted: true,
      moves: ++this.state.moves,
    });
  };

  newImage() {
    if (this.props.isUsingImage && this.props.images) {
      this.setState({
        imageNumber: (this.state.imageNumber + 1) % (this.props.images.length),
      });
    }
  }

  getNewBoard = (move = 1) => {
    this.newImage();
    let indx = (this.state.board_original + move) % (LIGHTOUT_BOARDS.length);
    if (indx < 0) {
      indx = LIGHTOUT_BOARDS.length - 1;
    }
    this.setState({
      boards: LIGHTOUT_BOARDS[indx].map(function (row) {
        return row.map(function (cell) {
          return cell;
        });
      }),
      board_original: indx,
      moves: 0,
      gameState: GAME_IDLE,
      isGameStarted: false,
      isGameRunning: true,
      boardId: uuid.v4(),
    });
  };

  onRefreshClick = () => {
    this.setState({
      gameState: GAME_IDLE,
      isGameStarted: false,
      moves: 0,
      boardId: uuid.v4(),
      boards: LIGHTOUT_BOARDS[this.state.board_original].map(function (row) {
        return row.map(function (cell) {
          return cell;
        });
      }),
    });
  };

  handleGamePause = () => {
    this.setState({
      gameState: GAME_PAUSE,
      isGameRunning: false,
    });
  };

  handleGamePlay = () => {
    this.setState({
      gameState: GAME_STARTED,
      isGameRunning: true,
      isGameStarted: true,
    });
  };

  isGameOver = () => {
    this.setState({
      gameState: GAME_OVER,
      isPlayerWin: true,
    });
  };

  handleSwitchClick = (rowIdx, cellIdx) => {
    if (this.state.gameState === GAME_OVER) {
      return;
    }
    if (this.state.gameState === GAME_PAUSE) {
      this.handleGamePlay();
    }
    
//this is setting the state of the cell clicked and the adjacent cells 

    const currentBoard = this.state.boards;
    currentBoard[rowIdx][cellIdx] = !currentBoard[rowIdx][cellIdx];
    if (rowIdx !== 0) currentBoard[rowIdx - 1][cellIdx] = !currentBoard[rowIdx - 1][cellIdx];
    if (rowIdx !== currentBoard[rowIdx].length - 1) currentBoard[rowIdx + 1][cellIdx] = !currentBoard[rowIdx + 1][cellIdx];
    if (cellIdx !== 0) currentBoard[rowIdx][cellIdx - 1] = !currentBoard[rowIdx][cellIdx - 1];
    if (cellIdx !== currentBoard.length - 1) currentBoard[rowIdx][cellIdx + 1] = !currentBoard[rowIdx][cellIdx + 1];

    this.setState({
      gameState: GAME_STARTED,
      isGameRunning: true,
      isGameStarted: true,
      boards: currentBoard,
      moves: this.state.moves + 1,
    });

    let isGameOver = true;
    this.state.boards.forEach((column) => {
      column.forEach((tile) => {
        if (!tile) {
          isGameOver = false;
        }
      });
    });

    if (isGameOver) {
      this.setState({
        gameState: GAME_OVER,
      });

      this.isGameOver();
    }
  };

  render() {
    const {
      intl,
      Element,
      localized,
      relax,
      styleClassMap,
      classes,
      isMoveCounterDisplay,
      isUsingImage,
      images,
      textWin,
    } = this.props;

    const {
      boardId,
      gridSize,
      gameState,
      moves,
      boards,
      imageNumber,
    } = this.state;

    if (relax.styleValues && relax.styleValues.display === 'none') { return null; }

    const l = intl.formatMessage;

    let btnLeftFunc = () => this.onRefreshClick();
    let btnLeftIcon = "refresh";
    let btnLeftTitle = l({ id: 'Game.resetLevel', defaultMessage: 'Reset level' });

    if (moves === 0) {
      btnLeftFunc = () => this.getNewBoard(-1);
      btnLeftIcon = "chevron_left";
      btnLeftTitle = l({ id: 'Game.previousLevel', defaultMessage: 'Previous level' });
    }

    let btnRightFunc = () => this.getNewBoard(1);
    let btnRightIcon = "navigate_next";
    let btnRightTitle = l({ id: 'Game.nextLevel', defaultMessage: 'Next level' });

    if (gameState === GAME_STARTED) {
      btnRightFunc = () => this.handleGamePause();
      btnRightIcon = "pause";
      btnRightTitle = l({ id: 'Game.pause', defaultMessage: 'Pause' });
    }
    else if (gameState === GAME_PAUSE) {
      btnRightFunc = () => this.handleGamePlay();
      btnRightIcon = "play_arrow";
      btnRightTitle = l({ id: 'Game.play', defaultMessage: 'Play' });
    }

    return (
      <Element
        {...relax}
        style={{ flexDirection: 'column' }}
        htmlTag="div"
        settings={settings}
        className={styleClassMap.element}
      >
        <Paper
          className={classes.paperRoot}
        >
          <GameMenu
            isGameRunning={gameState === GAME_STARTED}
            styleClassMap={styleClassMap}
            key={`menu-${boardId}`}
            relax={relax}

            btnLeftFunc={btnLeftFunc}
            btnLeftClass={styleClassMap.button}
            btnLeftIcon={btnLeftIcon}
            btnLeftTitle={btnLeftTitle}

            btnRightFunc={btnRightFunc}
            btnRightClass={styleClassMap.button}
            btnRightIcon={btnRightIcon}
            btnRightTitle={btnRightTitle}

            isMovesShow={isMoveCounterDisplay}
            movesValue={moves}
            isTimeShow={true}
            victoryMsg={localized(textWin)}
            isPlayerWin={gameState === GAME_OVER}
          />

          <LightsOutBoard
            key={boardId}
            className={classes.lightsOutBoard}
            relax={relax}
            styleClassMap={styleClassMap}
            isGameOver={gameState === GAME_OVER}
            gridSize={gridSize}
            tileChangeClick={(rowIdx, cellIdx) => this.handleSwitchClick(rowIdx, cellIdx)}
            isUsingImage={isUsingImage}
            image={(isUsingImage && images) ? images[imageNumber] : null}
            boards={boards}
          />
        </Paper>
      </Element>
    );
  }
}
