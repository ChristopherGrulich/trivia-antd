import React from "react";
import Question from "./Question";
import Answer from "./Answer";
import createStateObj from "../utility/createStateObj";
import { nanoid } from "nanoid";
import ReactConfetti from "react-confetti";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import GameStats from "./GameStats";
import {CategoryProps} from "../utility/types"
import { Col, Radio, Row } from "antd";

export const Trivia: React.FC<CategoryProps> = (props: CategoryProps) => {
  const { promiseInProgress } = usePromiseTracker();
  const { categoryChoice } = props;
  const [gameData, setGameData] = React.useState([
    {
      question: "|question|",
      answerObjects: [
        {
          answerid: "nanoid",
          answer: "|mappedAnswer|",
          isCorrect: false,
          toggled: false,
        },
      ],
      correct_answer: "|correct_answer|",
    },
  ]);
  const numOfQuestions = gameData?.length; // Count of our total questions. (5 in this context, unless we change the API settings!)
  const [gameStats, setGameStats] = React.useState(
    JSON.parse(localStorage.getItem("gameStats")) || {
      totalGames: 0,
      totalWins: 0,
    }
  );

  const [endGame, setEndGame] = React.useState(false); // submit button
  const [scoreCount, setScoreCount] = React.useState(0); // track score
  const stateRef = React.useRef<number>(); // track score for callback functions
  stateRef.current = scoreCount;
  const [startNewGame, setStartNewGame] = React.useState(false);
  const [gameStage, setGameStage] = React.useState(0);
  // gameStage: Where we are on the app: 0 for fresh arrival on game page, 1 for submitted state, 2 for new game state

  React.useEffect(() => {
    trackPromise(
      fetch(categoryChoice)
        .then((res) => res.json())
        .then((data) =>
          setGameData(() =>
            data.results.map((item) => {
              return createStateObj(item, fixEscChars);
            })
          )
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startNewGame]);

  React.useEffect(() => {
    localStorage.setItem("gameStats", JSON.stringify(gameStats));
  }, [gameStats]);

  //

  function onClick(answerid, question) {
    setGameData((prevData) => {
      return prevData?.map((pam) => {
        const diffData = pam?.answerObjects?.map((ansObj) => {
          if (question === pam.question && answerid === ansObj.answerid) {
            return {
              ...ansObj,
              toggled: true,
            };
          } else if (question === pam.question) {
            return {
              ...ansObj,
              toggled: false,
            };
          } else {
            return ansObj;
          }
        });
        return {
          ...pam,
          answerObjects: diffData,
        };
      });
    });
  }

  function correctChecker() {
    setGameData((prevData) => {
      return prevData?.map((pom) => {
        const upd = pom?.answerObjects?.map((innerPom) => {
          if (innerPom.toggled && pom.correct_answer === innerPom.answer) {
            setScoreCount((prevCount) => prevCount + 1);
            return {
              ...innerPom,
              isCorrect: true,
            };
          } else {
            return innerPom;
          }
        });
        return {
          ...pom,
          answerObjects: upd,
        };
      });
    });
    gameBoard(); // Game statistics
  }

  function gameBoard() {
    setScoreCount((prevCount) => {
      setGameStats((prevStats) => {
        return {
          ...prevStats,
          totalGames: prevStats.totalGames + 1,
          totalWins:
            stateRef.current === numOfQuestions // stateRef.current for use of states in callback functions. (Function closures)
              ? prevStats.totalWins + 1
              : prevStats.totalWins,
        };
      });
      return prevCount;
    });
  }

  function fixEscChars(stringValue) {
    return stringValue
      .replaceAll("&#039;", "'")
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", '"')
      .replaceAll("&Auml;", "Ä")
      .replaceAll("&auml;", "ä")
      .replaceAll("&agrave;", "à")
      .replaceAll("&Agrave;", "À")
      .replaceAll("&Aring;", "Å")
      .replaceAll("&aring;", "å")
      .replaceAll("&Ccedil;", "Ç")
      .replaceAll("&ccedil;", "ç")
      .replaceAll("&Eacute;", "É")
      .replaceAll("&eacute;", "é")
      .replaceAll("&Egrave;", "È")
      .replaceAll("&egrave;", "è")
      .replaceAll("&szlig;", "ß")
      .replaceAll("&ldquo;", "“")
      .replaceAll("&rdquo;", "”");
  }

  function submit() {
    correctChecker();
    setEndGame(true);
    setGameStage(1); // Proceed to stage 1
  }

  function newGame() {
    setEndGame(false);
    setStartNewGame((prev) => !prev);
    setScoreCount(0);
    setGameStage(0); // Reset game
  }



  const gameElements = gameData?.map((trivia) => {
    return (
      <div className="game-container" key={nanoid()}>
        <div className="question-container">
          <Question question={trivia.question} />
        </div>
        <div className="answer-container">

          <Radio.Group
          name={trivia.question}
          >
          <Row justify="space-evenly">

          {trivia?.answerObjects?.map((innerTrivia) => {
            return (
                <Answer
                  key={nanoid()}
                  answer={innerTrivia.answer}
                  onClick={() => onClick(innerTrivia.answerid, trivia.question)}
                  toggled={innerTrivia.toggled}
                  isCorrect={innerTrivia.isCorrect}
                  gameOver={endGame}
                  question={trivia.question}
                />
                
            );
          })}
          </Row>
          </Radio.Group>
          
          </div>

        {gameStage === 1 && (
          <div className="correct-answer">
            <p>
              Correct Answer:
              {" " + fixEscChars(trivia.correct_answer)}
            </p>
          </div>
        )}
        <hr></hr>
      </div>
    );
  });

  return (
    <div className="game-container">
      {promiseInProgress && 
      <h2 className="loading">Loading, please wait...</h2>}

      {!promiseInProgress && gameStage === 0 && (
        <div>
          {gameElements}
          <div className="button-box">
            <div className="button" onClick={submit}>
              Submit Answers
            </div>
          </div>
        </div>
      )}
      {gameStage === 1 && (
        <div>
          {gameElements}
          <div className="round-over">
            <h3>
              Score: {scoreCount} / {numOfQuestions}
            </h3>
            {scoreCount === numOfQuestions && (
              <div>
                <ReactConfetti />
                <h3>Perfect score, congrats!</h3>
              </div>
            )}
            <h3>Up for another round?</h3>
            <div className="button-box">
              <div className="button" onClick={newGame}>
                Start New Game
              </div>
            </div>
          </div>
        </div>
      )}
      <GameStats
        totalGames={gameStats?.totalGames}
        totalWins={gameStats?.totalWins}
      />
    </div>
  );
}

export default Trivia