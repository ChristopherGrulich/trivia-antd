import React from "react";
import { nanoid } from "nanoid";
import { Radio, ConfigProvider } from 'antd';
import { AnswerProps } from "../utility/types";

export const Answer: React.FC<AnswerProps> = (props: AnswerProps) => {
  const { 
    answer,
    question, 
    onClick, 
    toggled, 
    isCorrect, 
    gameOver 
  } = props;

  ConfigProvider.config(
    {
    theme: {
      primaryColor: 'rgb(87, 183, 106)',
    },
  });

  function style() {

      if (toggled) {
        if (gameOver) {
          if (isCorrect) {
              return {backgroundColor: "rgb(87, 183, 106)"}
          } else {
              return {backgroundColor: "rgb(243, 139, 139)"}
          }
        } else {
              return {backgroundColor: "rgb(85, 187, 254)"}
        }
      }
  }

  return (
    // <div key={nanoid()} style={{ color: style() }}>
    <div key={nanoid()} style={{ color: 'var(--ant-primary-color)' }}>
      <Radio.Button 
      value={answer}
      checked={toggled}
      // onChange={onClick}
      >
      {answer}
      </Radio.Button>
      <br></br>
    </div>
  );
}

export default Answer